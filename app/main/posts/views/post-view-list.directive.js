module.exports = PostListDirective;

PostListDirective.$inject = [];
function PostListDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '='
        },
        controller: PostListController,
        template: require('./post-view-list.html')
    };
}

PostListController.$inject = [
    '$scope',
    '$q',
    '$translate',
    'PostEndpoint',
    'Notify',
    'PostViewService',
    '_',
    'ConfigEndpoint',
    'moment',
    'PostFilters',
    'PostActionsService'
];
function PostListController(
    $scope,
    $q,
    $translate,
    PostEndpoint,
    Notify,
    PostViewService,
    _,
    ConfigEndpoint,
    moment,
    PostFilters,
    PostActionsService
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
    $scope.loadMore = loadMore;

    activate();

    // whenever the filters changes, update the current list of posts
    $scope.$watch(function () {
        return $scope.filters;
    }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
            resetPosts();
            getPosts();
        }
    }, true);

    function activate() {
        // Initial load
        resetPosts();
        getPosts();

        $scope.$watch('selectedPosts.length', function () {
            $scope.$emit('post:list:selected', $scope.selectedPosts);
        });
    }

    function resetPosts() {
        $scope.posts = [];
        $scope.groupedPosts = {};
        $scope.totalItems = $scope.itemsPerPage;
        $scope.currentPage = 1;
        $scope.selectedPosts = [];
    }

    function getPosts(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        var postQuery = _.extend({}, query, {
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage
        });

        $scope.isLoading = true;
        PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
            // Add posts to full set of posts
            // @todo figure out if we can store these more efficiently
            Array.prototype.push.apply($scope.posts, postsResponse.results);

            // Merge grouped posts into existing groups
            angular.forEach(groupPosts(postsResponse.results), function (posts, group) {
                if (angular.isArray($scope.groupedPosts[group])) {
                    Array.prototype.push.apply($scope.groupedPosts[group], posts);
                } else {
                    $scope.groupedPosts[group] = posts;
                }
            });

            $scope.totalItems = postsResponse.total_count;
            $scope.isLoading = false;

            if ($scope.posts.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }
        });
    }

    function groupPosts(posts) {
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
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        })
        ;
    }

    // @todo reconsider: show this for ALL logged in users??
    function userHasBulkActionPermissions() {
        return _.any($scope.posts, function (post) {
            return _.intersection(post.allowed_privileges, ['update', 'delete', 'change_status']).length > 0;
        });
    }

    function hasFilters() {
        return PostFilters.hasFilters($scope.filters);
    }

    function loadMore() {
        // Increment page
        $scope.currentPage++;
        getPosts();
    }
}
