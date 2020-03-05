module.exports = PostViewData;

PostViewData.$inject = [];
function PostViewData() {
    return {
        restrict: 'E',
        scope: {
            post: '<',
            collection: '<',
            savedSearch: '<'
        },
        controller: PostViewDataController,
        template: require('./post-view-data.html')
    };
}

PostViewDataController.$inject = [
    '$scope',
    '$rootScope',
    'PostFilters',
    '_',
    'PostEndpoint',
    'PostViewService',
    'moment',
    '$translate',
    '$q',
    'PostActionsService',
    '$timeout',
    '$location',
    'Notify',
    '$window',
    '$state',
    'LoadingProgress',
    '$transitions'
];
function PostViewDataController(
    $scope,
    $rootScope,
    PostFilters,
    _,
    PostEndpoint,
    PostViewService,
    moment,
    $translate,
    $q,
    PostActionsService,
    $timeout,
    $location,
    Notify,
    $window,
    $state,
    LoadingProgress,
    $transitions
) {
    $scope.currentPage = 1;
    $scope.selectedPosts = [];
    $scope.itemsPerPageOptions = [10, 20, 50];
    $scope.itemsPerPage = $scope.itemsPerPageOptions[1];
    // until we have the correct total_count value from backend request:
    $scope.totalItems = 0;
    $scope.posts = [];
    $scope.groupedPosts = {};
    $scope.deletePosts = deletePosts;
    $scope.hasFilters = hasFilters;
    $scope.userHasBulkActionPermissions = userHasBulkActionPermissions;
    $scope.statuses = PostActionsService.getStatuses();
    $scope.changeStatus = changeStatus;
    $scope.showPost = showPost;
    $scope.loadMore = loadMore;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.clearSelectedPosts = clearSelectedPosts;
    $scope.newPostsCount = 0;
    var recentPosts = [];
    $scope.addNewestPosts = addNewestPosts;
    $scope.selectBulkActions = selectBulkActions;
    $scope.bulkActionsSelected = '';
    $scope.closeBulkActions = closeBulkActions;
    $scope.selectedPost = {post: $scope.post, next: {}};
    $scope.formData = {form: {}};
    $scope.getPosts = getPosts;
    $scope.shouldWeRunCheckForNewPosts = true;
    $scope.activeCol = $state.params.activeCol;
    $scope.deselectPost = deselectPost;
    $scope.removePostThatDoesntMatchFilters = removePostThatDoesntMatchFilters;

    var stopInterval;
    /**
     * setting "now" time as utc for new posts filter
     */
    let timeOfPageLoad = moment().utc();

    let unbindFns = [];

    // This is for when you edit a post. Because anything could be changing, we have to
    // check to see if everything in the post still matches all the filters.
    // It's too cumbersome to do on the frontend, so we're checking in the API
    unbindFns.push($scope.$on('event:edit:post:data:mode:saveSuccess', function (event, args) {
        let post = args.post;
        $scope.removePostThatDoesntMatchFilters(post);
    }));


    // And this is for when you change the post status using the ... button
    // Because it's just the post status only, we're just checking if it matches
    // filters on the frontend. This makes it MUCH faster than using the API

    unbindFns.push($scope.$on('event:edit:post:status:data:mode:saveSuccess', function (event, args) {
        let postObj = args.post;
        if (args.deleted || !newStatusMatchesFilters(postObj)) {
            removePostFromList(postObj);
        }
    }));

    unbindFns.push($transitions.onSuccess({
        to: 'posts.data.**'
    }, () => {
        $scope.activeCol = $state.params.activeCol;
    }));

    unbindFns.push($transitions.onSuccess({
        to: 'posts.data.*'
    }, () => {
        $scope.selectedPost.post = _.findWhere($scope.posts, { id: parseInt($state.params.postId, 10) });
    }));

    // Cleanup and remove all listeners
    $scope.$on('$destroy', () => {
        unbindFns.forEach(Function.prototype.call, Function.prototype.call);
    });

    activate();
    function activate() {
        // Set the page title
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        $scope.filters = PostFilters.getFilters();

        // If we are coming into Data View with a selected post
        // then go get 19 posts before that post and put those in the post list
        // *
        // *
        // Otherwise, go get posts just normal
        if ($scope.selectedPost.post) {
            let query = PostFilters.getQueryParams($scope.filters);
            // Some posts may have their created date redacted by hide_time
            // we instead use the Post Id to allow the API to retrieve the date itself
            query.created_before_by_id = $scope.selectedPost.post.id;
            getPosts(query, false);
            $scope.shouldWeRunCheckForNewPosts = false;
        } else {
            getPosts(false, false);
        }
        // whenever the reactiveFilters var changes, do a dummy update of $scope.filters.reactiveFilters
        // to force the $scope.filters watcher to run
        $scope.$watch(function () {
            return PostFilters.reactiveFilters;
        }, function () {
            if (PostFilters.reactiveFilters === true) {
                $scope.filters.reactToFilters = $scope.filters.reactToFilters ? !$scope.filters.reactToFilters : true;
            }
        }, true);
        /** whenever the filters changes, update the current list of posts **/
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (PostFilters.reactiveFilters === true && (newValue !== oldValue)) {
                getPosts(false, false, true, goToFirstPostIfPostDoesNotMatchFilters);
                PostFilters.reactiveFilters = false;
            }
        }, true);
        $scope.$watch('selectedPosts.length', function () {
            $scope.$emit('post:list:selected', $scope.selectedPosts);
        });

        $scope.$on('$destroy', function (ev) {
                $timeout.cancel(stopInterval);
            }
        );

        $scope.$on('event:edit:leave:form:complete', function () {
            // Because there is no state management
            // We copy the next Post to be the current Post
            // if the previous Post exited correctly
            // Ideally Post Card would become a service more akin
            // to Notify and manage its own scope
            if (!_.isEmpty($scope.selectedPost.next)) {
                $scope.selectedPost.post = $scope.selectedPost.next;
                $scope.selectedPost.next = {};
                $rootScope.$broadcast('event:edit:post:reactivate');
            }
        });

        // When a Post has been saved in the Data View it must be updated in the
        // Post list so that the change will persist.
        // This event is expected to be fired on successful completion of a Post save
        // it expects the updated Post data as an argument passed via the event
        $scope.$on('event:edit:post:data:mode:saveSuccess', function (event, args) {
            if (args.post) {
                persistUpdatedPost(args.post);
            }
        });

        if ($scope.shouldWeRunCheckForNewPosts) {
            checkForNewPosts(60000);
        }
    }

    function deselectPost() {
        $scope.selectedPost = {post: null, next: {}};
    }
    function goToFirstPostIfPostDoesNotMatchFilters() {
        if ($scope.selectedPost.post && $scope.posts[0]) {
            postDoesNotMatchFilters($scope.selectedPost.post).then((bool) => {
                if (bool) {
                    $scope.selectedPost.post = $scope.posts[0];
                    $state.go('posts.data.detail', {view: 'data', postId: $scope.posts[0].id});
                }
            });
        }
    }

    function postDoesNotMatchFilters(postObj) {
        var deferred = $q.defer();

        if ($scope.hasFilters()) {
            let query = PostFilters.getQueryParams($scope.filters);
            let postQuery = _.extend({}, query, {
                post_id: postObj.id
            });

            PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                if (postsResponse.count === 0) {
                    deferred.resolve(true);
                } else {
                    deferred.reject(false);
                }
            });
        } else {
            deferred.reject(false);
        }
        return deferred.promise;
    }

    function removePostThatDoesntMatchFilters(postObj) {
        postDoesNotMatchFilters(postObj).then((bool) => {
            if (bool) {
                removePostFromList(postObj);
            }
        });
    }

    function removePostFromList(postObj) {
        $scope.posts.forEach((post, index) => {
            // args.post is the post being updated/saved and sent from the broadcast
            // since a single post is being deleted here, reduce count of totalitems by 1.
            if (post.id === postObj.id) {
                let nextInLine = $scope.posts[index + 1];
                $scope.posts.splice(index, 1);
                $scope.totalItems = $scope.totalItems - 1;
                if ($scope.posts.length) {
                    groupPosts($scope.posts);
                    if ($scope.selectedPost.post) {
                        $scope.selectedPost.post = nextInLine;
                        $state.go('posts.data.detail', {view: 'data', postId: $scope.selectedPost.post.id});
                    }
                } else {
                    $scope.selectedPost = {post: null, next: {}};
                    getPosts(false, false);
                }
            }
        });
    }

    function newStatusMatchesFilters(postObj) {
        let filters = $scope.hasFilters() ?  $scope.filters.status : PostFilters.getDefaults().status;
        let matchingStatus = false;

        filters.forEach((status) => {
            if (postObj.status === status) {
                matchingStatus = true;
            }
        });

        return matchingStatus;
    }

    function persistUpdatedPost(updatedPost) {
        var index = _.findIndex($scope.posts, function (post) {
            return post.id === updatedPost.id;
        });
        $scope.posts.splice(index, 1, updatedPost);
    }

    function confirmEditingExit() {
        var deferred = $q.defer();
        if ($state.$current.name !== 'posts.data.edit') {
            deferred.resolve();
        } else if ($scope.formData.form && !$scope.formData.form.$dirty) {
            deferred.resolve();
        } else {
            Notify.confirmLeave('notify.post.leave_without_save').then(function () {
                //PostLockService.unlockSilent($scope.selectedPost);
                deferred.resolve();
            }, function (reject) {
                deferred.reject();
            });
        }
        return deferred.promise;
    }

    function showPost(post, fromWhere) {
        return confirmEditingExit().then(function () {
            $scope.selectedPost.post = post;
            $state.go('posts.data.detail', {postId: post.id});
        }, function () {
        });
    }

    function getPosts(query, useOffset, clearPosts, callback) {
        query = query || PostFilters.getQueryParams($scope.filters);

        var postQuery = _.extend({}, query, {
            limit: $scope.itemsPerPage
        });
        if (useOffset === true) {
            postQuery.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
        }
        PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
            //Clear posts
            clearPosts ? resetPosts() : null;
            
            // If we're loading posts for the first time and we have a selected post (post detail view)
            // check to see that the selected post isn't in the list
            // and then deselect it and select the first item
            if (!$scope.posts.length && $scope.selectedPost.post) {
                const selectedPostInResponse = postsResponse.results.find((post) => {
                    return post.id === $scope.selectedPost.post.id;
                });
                if (!selectedPostInResponse) {
                    $scope.selectedPost.post = postsResponse.results[0];
                    $state.go('posts.data.detail', {view: 'data', postId: $scope.selectedPost.post.id});
                }
            }
            // Add posts to full set of posts
            // @todo figure out if we can store these more efficiently
            Array.prototype.push.apply($scope.posts, postsResponse.results);

            // Merge grouped posts into existing groups
            groupPosts(postsResponse.results);

            $scope.totalItems = postsResponse.total_count;
            if ($scope.posts.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }

            if (callback) {
                callback();
            }
        });
    }

    // this function is called when multiple data items are deleted
    function deletePosts() {
        Notify.confirmDelete('notify.post.bulk_destroy_confirm', { count: $scope.selectedPosts.length }).then(function () {
            // ask server to delete selected posts
            // and refetch posts from server
            var deletePostsPromises = _.map(
                $scope.selectedPosts,
                function (postId) {
                    $scope.selectedPosts = _.without($scope.selectedPosts, postId);
                    return PostEndpoint.delete({ id: postId }).$promise;
                });
            $q.all(deletePostsPromises).then(handleDeleteSuccess, handleDeleteErrors)
            ;

            function handleDeleteErrors(errorResponse) {
                Notify.apiErrors(errorResponse);
            }
            function handleDeleteSuccess(deleted) {
                Notify.notify('notify.post.destroy_success_bulk');
                // Remove deleted posts from state
                var deletedIds = _.pluck(deleted, 'id');
                $scope.totalItems = $scope.totalItems - deletedIds.length;
                angular.forEach($scope.groupedPosts, function (posts, group) {
                    $scope.groupedPosts[group] = _.reject(posts, function (post) {
                        return _.contains(deletedIds, post.id);
                    });
                });
                $scope.posts = _.reject($scope.posts, function (post) {
                    return _.contains(deletedIds, post.id);
                });
                clearSelectedPosts();

                if (!$scope.posts.length) {
                    getPosts(false, false, true);
                }
            }
        });
    }

    function changeStatus(status) {
        var selectedPosts = _.filter($scope.posts, function (post) {
            return _.contains($scope.selectedPosts, post.id);
        });

        var count = $scope.selectedPosts.length;

        var updateStatusPromises = _.map(selectedPosts, function (post) {
            post.status = status;
            // $scope.selectedPosts = _.without($scope.selectedPosts, post.id);
            return PostEndpoint.update(post).$promise;
        });

        $q.all(updateStatusPromises).then(function () {
            Notify.notify('notify.post.update_status_success_bulk', {count: count});
            selectedPosts.forEach((post) => {
                if (!newStatusMatchesFilters(post)) {
                    removePostFromList(post);
                }
            });
            clearSelectedPosts();
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    }

    function createPostGroups(posts) {
        var now = moment(),
            yesterday = moment().subtract(1, 'days');

        return _.groupBy(posts, function (post) {
            var postDate = moment(post.post_date);
            if (now.isSame(postDate, 'd')) {
                return $translate.instant('nav.today');
            } else if (yesterday.isSame(postDate, 'd')) {
                return $translate.instant('nav.yesterday');
            } else {
                return postDate.fromNow();
            }
        });
    }

    function hasFilters() {
        return PostFilters.hasFilters($scope.filters);
    }

    function groupPosts(postList) {
        angular.forEach(createPostGroups(postList), function (posts, group) {
            if (angular.isArray($scope.groupedPosts[group])) {
                Array.prototype.unshift.apply($scope.groupedPosts[group], posts);
            } else {
                $scope.groupedPosts[group] = posts;
            }
        });
    }

    function resetPosts() {
        $scope.posts = [];
        $scope.groupedPosts = {};
        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.selectedPosts = [];
        recentPosts = [];
        $scope.newPostsCount = 0;
    }

    function loadMore() {
        // Increment page
        $scope.currentPage++;
        getPosts(false, true, false);
    }

    function selectBulkActions() {
        $scope.bulkActionsSelected = true;
    }

    function closeBulkActions() {
        $scope.bulkActionsSelected = '';
    }

    function clearSelectedPosts() {
        // Clear selected posts
        $scope.selectedPosts.splice(0);
    }

    function userHasBulkActionPermissions() {
        return _.any($scope.posts, function (post) {
            return _.intersection(post.allowed_privileges, ['update', 'delete', 'change_status']).length > 0;
        });
    }

    function getUnique(arr, comp) {
        const unique = arr
            .map(ele => ele[comp]) // store the keys of the unique objects
            .map((ele, i, final) => final.indexOf(ele) === i && i) // eliminate the dead keys & store unique objects
            .filter(ele => arr[ele])
            .map(ele => arr[ele]);

        return unique;
    }

    function getNewPosts() {
        let existingFilters = PostFilters.getQueryParams($scope.filters);
        let filterDate = moment(existingFilters.date_before).utc();

        // if the filter end date was set to earlier than the time of page load
        // there could not possibly be any reason to check for new posts
        if (timeOfPageLoad.isSameOrBefore(filterDate) &&
            existingFilters.order === 'desc' &&
            existingFilters.orderby === 'created' // @todo handle update or post_date ordering
        ) {
            let postQuery;
            // If there are not any posts yet
            // *
            // *
            // query for any posts created after the time we loaded the page
            if (!$scope.posts) {
                postQuery = _.extend({}, existingFilters, {
                    order: $scope.filters.order,
                    orderby: $scope.filters.orderby,
                    // Important to use `created_after` here, `date_after` compares against `post_date` not `created`
                    created_after: timeOfPageLoad.format()
                });
            } else {
                postQuery = _.extend({}, existingFilters, {
                    order: $scope.filters.order,
                    orderby: $scope.filters.orderby,
                    created_after_by_id: $scope.posts[0].id
                });
            }

            PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                Array.prototype.unshift.apply(recentPosts, postsResponse.results);
                recentPosts = getUnique(recentPosts, 'id');
                $scope.newPostsCount = postsResponse.count;

            });
        }
    }

    function addNewestPosts() {
        Array.prototype.unshift.apply($scope.posts, recentPosts);
        groupPosts(recentPosts);
        $scope.totalItems = $scope.totalItems + $scope.newPostsCount;
        recentPosts = [];
        $scope.newPostsCount = 0;
        $window.document.getElementById('post-data-view-top').scrollTop = 0;
    }

    function checkForNewPosts(time) {

        if ($scope.posts.length) {
            getNewPosts();
        }
        stopInterval = $timeout(checkForNewPosts, time, true, time);
    }
}

