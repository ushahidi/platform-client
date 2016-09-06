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
    $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
    // until we have the correct total_count value from backend request:
    $scope.totalItems = $scope.itemsPerPage;

    $scope.deletePosts = deletePosts;
    $scope.hasFilters = hasFilters;
    $scope.itemsPerPageChanged = itemsPerPageChanged;
    $scope.userHasBulkActionPermissions = userHasBulkActionPermissions;
    $scope.pageChanged = getPostsForPagination;
    $scope.statuses = PostActionsService.getStatuses();
    $scope.changeStatus = changeStatus;

    activate();

    // whenever the filters changes, update the current list of posts
    $scope.$watch(function () {
        return $scope.filters;
    }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
            getPostsForPagination();
        }
    }, true);

    function activate() {
        // Initial load
        getPostsForPagination();

        $scope.$watch('selectedPosts.length', function () {
            $scope.$emit('post:list:selected', $scope.selectedPosts);
        });
    }

    function getPostsForPagination(query) {
        query = query || PostFilters.getQueryParams($scope.filters);
        var postQuery = _.extend({}, query, {
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage
        });

        $scope.isLoading = true;
        PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
            if (postsResponse.count === 0 && !PostFilters.hasFilters($scope.filters)) {
                PostViewService.showNoPostsSlider();
            }
            $scope.posts = postsResponse.results;
            var now = moment(),
                yesterday = moment().subtract(1, 'days');

            $scope.groupedPosts = _.groupBy(postsResponse.results, function (post) {
                var postDate = moment(post.post_date);
                if (now.isSame(postDate, 'd')) {
                    return $translate.instant('nav.today');
                } else if (yesterday.isSame(postDate, 'd')) {
                    return $translate.instant('nav.yesterday');
                } else {
                    return postDate.fromNow();
                }
            });
            $scope.totalItems = postsResponse.total_count;
            $scope.isLoading = false;
        });
    }

    function deletePosts() {
        Notify.confirmDelete('notify.post.bulk_destroy_confirm', { count: $scope.selectedPosts.length }).then(function () {
            var handleDeleteErrors = function (errorResponse) {
                Notify.apiErrors(errorResponse);
            },
            handleDeleteSuccess = function () {
                Notify.notify('notify.post.destroy_success_bulk');
            };

            // ask server to delete selected posts
            // and refetch posts from server
            var deletePostsPromises = _.map(
                $scope.selectedPosts,
                function (postId) {
                    $scope.selectedPosts = _.without($scope.selectedPosts, postId);
                    return PostEndpoint.delete({ id: postId }).$promise;
                });
            $q.all(deletePostsPromises).then(handleDeleteSuccess, handleDeleteErrors)
            .finally(getPostsForPagination);
        });
    }

    function changeStatus(status) {
        var selectedPosts = _.filter($scope.posts, function (post) {
            return _.contains($scope.selectedPosts, post.id);
        });

        var count = $scope.selectedPosts.length;

        var updateStatusPromises = _.map(selectedPosts, function (post) {
            post.status = status;
            $scope.selectedPosts = _.without($scope.selectedPosts, post.id);
            return PostEndpoint.update(post).$promise;
        });

        $q.all(updateStatusPromises).then(function () {
            Notify.notify('notify.post.update_status_success_bulk', {count: count});
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        })
        .finally(getPostsForPagination);
    }

    function itemsPerPageChanged(count) {
        $scope.itemsPerPage = count;
        getPostsForPagination();
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

    $scope.open = true;
}
