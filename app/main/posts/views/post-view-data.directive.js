module.exports = PostViewData;

PostViewData.$inject = [];
function PostViewData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '=',
            currentView: '='
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
'PostLockService',
'$timeout',
'$location',
'$anchorScroll',
'Notify',
'$routeParams',
'$window'
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
    PostLockService,
    $timeout,
    $location,
    $anchorScroll,
    Notify,
    $routeParams,
    $window
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
    var clearPosts = false;
    $scope.clearSelectedPosts = clearSelectedPosts;
    $scope.newPostsCount = 0;
    var recentPosts = [];
    $scope.addNewestPosts = addNewestPosts;
    $scope.editMode = {editing: false};
    $scope.selectBulkActions = selectBulkActions;
    $scope.bulkActionsSelected = '';
    $scope.closeBulkActions = closeBulkActions;
    $scope.selectedPost = {post: null, next: {}};
    $scope.selectedPostId = null;
    $scope.formData = {form: {}};
    $rootScope.setLayout('layout-d');
    var stopInterval;
    /**
     * setting "now" time as utc for new posts filter
     */
    var newPostsAfter = moment().utc();
    $scope.savingPost = {saving: false};
    activate();
    function activate() {
        getPosts(false, false);
        // whenever the reactiveFilters var changes, do a dummy update of $scope.filters.reactiveFilters
        // to force the $scope.filters watcher to run
        $scope.$watch(function () {
            return PostFilters.reactiveFilters;
        }, function () {
            if (PostFilters.reactiveFilters === 'enabled') {
                $scope.filters.reactToFilters = $scope.filters.reactToFilters ? !$scope.filters.reactToFilters : true;
            }
        }, true);
        /** whenever the filters changes, update the current list of posts **/
        $scope.$watch(function () {
            return $scope.filters;
        }, function (newValue, oldValue) {
            if (PostFilters.reactiveFilters === 'enabled' && (newValue !== oldValue)) {
                clearPosts = true;
                getPosts(false, false);
                PostFilters.reactiveFilters = 'disabled';
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
            // if the previous Post existed correctly
            // Ideally Post Card would become a service more akin
            // to Notify
            if (!_.isEmpty($scope.selectedPost.next)) {
                $scope.selectedPost.post = $scope.selectedPost.next;
                $scope.selectedPost.next = {};
                $scope.editMode.editing = true;
                $rootScope.$broadcast('event:edit:post:reactivate');
            }
        });

        $scope.$watch(function () {
            return $location.path();
        }, function (newValue, oldValue) {
            if ($scope.editMode.editing) {
                var postId = newValue.match(/^\/posts\/([0-9]+)(\/|$)/);
                var locationUrlMatch = $location.path().match(/^\/posts\/([0-9]+)(\/|$)/);
                if (postId && postId.length > 1 && !locationUrlMatch) {
                    var tmpPost = _.filter($scope.posts, function (postItm) {
                        return postItm.id === parseInt(postId[1]);
                    });
                    if (tmpPost.length > 0) {
                        $scope.selectedPost.post = tmpPost[0];
                        $scope.selectedPostId = tmpPost[0].id;
                        $scope.editMode.editing = false;
                    }
                }
            }
        });
        checkForNewPosts(30000);
    }

    function confirmEditingExit() {
        var deferred = $q.defer();
        if (!$scope.editMode.editing) {
            deferred.resolve();
        } else if ($scope.formData.form && !$scope.formData.form.$dirty) {
            $scope.editMode.editing = false;
            $scope.isLoading.state = false;
            $scope.savingPost.saving = false;
            deferred.resolve();
        } else {
            Notify.confirmLeave('notify.post.leave_without_save').then(function () {
                //PostLockService.unlockSilent($scope.selectedPost);
                $scope.editMode.editing = false;
                $scope.isLoading.state = false;
                $scope.savingPost.saving = false;
                deferred.resolve();
            }, function (reject) {
                deferred.reject();
                $scope.editMode.editing = true;
                $scope.isLoading.state = false;
                $scope.savingPost.saving = false;
            });
        }
        return deferred.promise;
    }

    function goToPost(post) {
        angular.element(document.getElementById('bootstrap-app')).addClass('hidden');
        angular.element(document.getElementById('bootstrap-loading')).removeClass('hidden');
        $location.path('/posts/' + post.id);
    }

    function showPost(post) {

        return confirmEditingExit().then(function () {
            var currentWidth = $window.innerWidth;
            if (currentWidth > 1023) {
                $location.path('/posts/' + post.id, false);
                $scope.selectedPost.post = post;
                $scope.selectedPostId = post.id;
            } else {
                goToPost(post);
            }
        }, function () {

        });
    }

    function getPosts(query, useOffset) {
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
        $scope.isLoading.state = true;
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
            $scope.isLoading.state = false;
            if ($scope.posts.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }
        });
    }

    function deletePosts() {
        Notify.confirmDelete('notify.post.bulk_destroy_confirm', { count: $scope.selectedPosts.length }).then(function () {
            // ask server to delete selected posts
            // and refetch posts from server
            $scope.isLoading.state = true;
            var deletePostsPromises = _.map(
                $scope.selectedPosts,
                function (postId) {
                    $scope.selectedPosts = _.without($scope.selectedPosts, postId);
                    return PostEndpoint.delete({ id: postId }).$promise;
                });
            $q.all(deletePostsPromises).then(handleDeleteSuccess, handleDeleteErrors)
            ;

            function handleDeleteErrors(errorResponse) {
                $scope.isLoading.state = false;
                Notify.apiErrors(errorResponse);
            }
            function handleDeleteSuccess(deleted) {
                $scope.isLoading.state = false;
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
                    clearPosts = true;
                    getPosts(false, false);
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
            clearSelectedPosts();
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        })
        ;
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
        clearPosts = false;
        getPosts(false, true);
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
