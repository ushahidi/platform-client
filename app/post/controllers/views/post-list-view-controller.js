module.exports = [
    '$scope',
    '$translate',
    'PostEndpoint',
    'GlobalFilter',
    'Session',
    'Notify',
    '$q',
    '_',
    function (
        $scope,
        $translate,
        PostEndpoint,
        GlobalFilter,
        Session,
        Notify,
        $q,
        _
    ) {
        $translate('post.posts').then(function (title) {
            $scope.title = title;
            $scope.$emit('setPageTitle', title);
        });

        var getPostsForPagination = function (query) {
            query = query || GlobalFilter.getPostQuery();
            var postQuery = _.extend(query, {
                offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                limit: $scope.itemsPerPage
            });

            PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                $scope.posts = postsResponse.results;
                $scope.totalItems = postsResponse.total_count;
            });
        },
        handleResponseErrors = function (errorResponse) {
            var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
            errors && Notify.showAlerts(errors);
        };

        // whenever the GlobalFilter post query changes,
        // update the current list of posts
        $scope.$watch(function () {
            return JSON.stringify(GlobalFilter.getPostQuery());
        }, function (newValue, oldValue) {
            getPostsForPagination();
        });

        $scope.deleteSelectedPosts = function () {
            $translate('notify.post.destroy_confirm').then(function (message) {
                if (window.confirm(message)) {
                    // ask server to delete selected posts
                    // and refetch posts from server
                    var deletePostsPromises = _.map(
                        $scope.selectedItems,
                        function (post) {
                            return PostEndpoint.delete({ id: post.id }).$promise;
                        });
                    $q.all(deletePostsPromises).then(getPostsForPagination, handleResponseErrors)
                    .finally(getPostsForPagination);
                }
            });
        };

        $scope.itemsPerPageChanged = function (count) {
            $scope.itemsPerPage = count;
            getPostsForPagination();
        };

        $scope.userHasBulkActionPermissions = function () {
            return _.any($scope.posts, function (post) {
                return _.intersection(post.allowed_privileges, ['update', 'delete', 'change_status']).length > 0;
            });
        };

        $scope.unselectAllPosts = function () {
            _.forEach($scope.posts, function (post) {
                post.selected = false;
            });
        };

        $scope.selectAllPosts = function () {
            _.forEach($scope.posts, function (post) {
                post.selected = true;
            });
        };

        $scope.allSelectedOnCurrentPage = function () {
            return $scope.selectedItems.length === $scope.posts.length;
        };

        // --- start: initialization
        $scope.pageChanged = getPostsForPagination;
        $scope.currentPage = 1;
        $scope.selectedItems = [];
        $scope.itemsPerPageOptions = [10, 20, 50];
        $scope.itemsPerPage = $scope.itemsPerPageOptions[0];

        // untill we have the correct total_count value from backend request:
        $scope.totalItems = $scope.itemsPerPage;

        getPostsForPagination();
    }
];
