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
    $scope.totalItems = $scope.itemsPerPage;
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

    var stopInterval;
    /**
     * setting "now" time as utc for new posts filter
     */
    var newPostsAfter = moment().utc();

    let unbindFns = [];

    // This is for when you edit a post. Because anything could be changing, we have to
    // check to see if everything in the post still matches all the filters.
    // It's too cumbersome to do on the frontend, so we're checking in the API
    unbindFns.push($rootScope.$on('event:edit:post:data:mode:saveSuccess', function (event, args) {
        if ($scope.hasFilters()) {
            let query = PostFilters.getQueryParams($scope.filters);
            let postQuery = _.extend({}, query, {
                post_id: args.post.id
            });

            PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                if (postsResponse.count === 0) {
                    removePostFromList(args.post);
                }
            });
        }
    }));

    // And this is for when you change the post status using the ... button
    // Because it's just the post status only, we're just checking if it matches
    // filters on the frontend. This makes it MUCH faster than using the API
    unbindFns.push($rootScope.$on('event:edit:post:status:data:mode:saveSuccess', function (event, args) {
        let postObj = args.post;
        if (!newStatusMatchesFilters(postObj)) {
            removePostFromList(postObj);
        }
    }));

    unbindFns.push($transitions.onSuccess({
        to: 'posts.data.**'
    }, () => {
        $scope.activeCol = $state.params.activeCol;
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

        // Grab initial filters
        if ($scope.collection) {
            PostFilters.setMode('collection', $scope.collection.id);
        } else if ($scope.savedSearch) {
            PostFilters.setMode('savedsearch', $scope.savedSearch.id);
        } else {
            PostFilters.setMode('all');
        }
        $scope.filters = PostFilters.getFilters();

        // If we are coming into Data View with a selected post
        // then go get 19 posts before that post and put those in the post list
        // *
        // *
        // Otherwise, go get posts just normal
        if ($scope.selectedPost.post) {
            let query = PostFilters.getQueryParams($scope.filters);
            query.created_before = $scope.selectedPost.post.created;
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
                getPosts(false, false, true);
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
            // Bercause there is no state management
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

        // I don't know what this does but its terrifying
        //
        // $scope.$watch(function () {
        //     return $location.path();
        // }, function (newValue, oldValue) {
        //     if ($scope.editMode.editing) {
        //         var postId = newValue.match(/^\/posts\/([0-9]+)(\/|$)/);
        //         var locationUrlMatch = $location.path().match(/^\/posts\/([0-9]+)(\/|$)/);
        //         if (postId && postId.length > 1 && !locationUrlMatch) {
        //             var tmpPost = _.filter($scope.posts, function (postItm) {
        //                 return postItm.id === parseInt(postId[1]);
        //             });
        //             if (tmpPost.length > 0) {
        //                 $scope.selectedPost.post = tmpPost[0];
        //                 $scope.editMode.editing = false;
        //             }
        //         }
        //     }
        // });
        if ($scope.shouldWeRunCheckForNewPosts) {
            checkForNewPosts(30000);
        }
    }

    function removePostFromList(postObj) {
        $scope.posts.forEach((post, index) => {
            // args.post is the post being updated/saved and sent from the broadcast
            if (post.id === postObj.id) {
                let nextInLine = $scope.posts[index + 1];
                $scope.posts.splice(index, 1);
                if ($scope.posts.length) {
                    groupPosts($scope.posts);
                    $scope.selectedPost.post = nextInLine;
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

    function getPosts(query, useOffset, clearPosts) {
        query = query || PostFilters.getQueryParams($scope.filters);
        PostEndpoint.stats(query).$promise.then(function (results) {
            $scope.total = results.totals[0].values[0].total;
        });

        var postQuery = _.extend({}, query, {
            limit: $scope.itemsPerPage
        });
        if (useOffset === true) {
            postQuery.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
        }
        PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
            //Clear posts
            clearPosts ? resetPosts() : null;
            // Add posts to full set of posts
            // @todo figure out if we can store these more efficiently
            Array.prototype.push.apply($scope.posts, postsResponse.results);

            // Use the most recent post date as the date to search for new posts since
            if ($scope.posts.length > 0 && $scope.posts[0].created) {
                newPostsAfter = moment($scope.posts[0].created).utc().add(1, 's');
            }

            // Merge grouped posts into existing groups
            groupPosts(postsResponse.results);

            $scope.totalItems = postsResponse.total_count;
            if ($scope.posts.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }
        });
    }

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
        $scope.totalItems = $scope.itemsPerPage;
        $scope.currentPage = 1;
        $scope.selectedPosts = [];
        recentPosts = [];
        $scope.newPostsCount = 0;
        newPostsAfter = moment().utc();
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

    function getNewPosts() {
        var existingFilters = PostFilters.getQueryParams($scope.filters);
        var filterDate = moment(existingFilters.date_before).utc();
        if (newPostsAfter.isSameOrBefore(filterDate) &&
            existingFilters.order === 'desc' &&
            existingFilters.orderby === 'created' // @todo handle update or post_date ordering
        ) {
            var query = existingFilters;
            var postQuery = _.extend({}, query, {
                order: $scope.filters.order,
                orderby: $scope.filters.orderby,
                // Important to use `created_after` here, `date_after` compares against `post_date` not `created`
                created_after: newPostsAfter.format()
            });
            PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                Array.prototype.unshift.apply(recentPosts, postsResponse.results);
                $scope.newPostsCount += postsResponse.count;
                if (postsResponse.count > 0) {
                    // after we get the posts, we set the mostrecentpost
                    // Use the most recent post date as the date to search for new posts since
                    newPostsAfter = moment(postsResponse.results[0].created).utc().add(1, 's');
                }

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

