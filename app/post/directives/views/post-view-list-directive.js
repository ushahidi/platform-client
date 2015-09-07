module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$q',
        '$translate',
        'PostEndpoint',
        'CollectionEndpoint',
        'Session',
        'Notify',
        '_',
        function (
            $scope,
            $q,
            $translate,
            PostEndpoint,
            CollectionEndpoint,
            Session,
            Notify,
            _
        ) {
            var getPostsForPagination = function (query) {
                query = query || $scope.filters;
                var postQuery = _.extend({}, query, {
                    offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
                    limit: $scope.itemsPerPage
                });

                $scope.isLoading = true;
                PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
                    $scope.posts = postsResponse.results;
                    $scope.totalItems = postsResponse.total_count;
                    $scope.isLoading = false;
                });
            },
            handleResponseErrors = function (errorResponse) {
                var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                errors && Notify.showAlerts(errors);
            };

            // whenever the filters changes, update the current list of posts
            $scope.$watch(function () {
                return $scope.filters;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    getPostsForPagination();
                }
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

            $scope.addSelectedPostsToCollection = function (selectedCollection) {
                if ($scope.selectedItems.length === 0) {
                    return;
                }
                var collectionId = selectedCollection.id,
                    collection = selectedCollection.name,
                    // Add each post to the collection and return a promise
                    promises = _.map($scope.selectedItems, function (post) {
                        return CollectionEndpoint.addPost({'collectionId': collectionId, 'id': post.id}).$promise;
                    });

                // Show a single notification when all selected posts have been added to the collection
                $q.all(promises).then(function () {
                    $translate('notify.collection.bulk_add_to_collection', {
                        count: $scope.selectedItems.length,
                        collection: collection
                    }).then(function (message) {
                        Notify.showSingleAlert(message);
                    });
                    // Deselect posts
                    _.forEach($scope.selectedItems, function (post) {
                        post.selected = false;
                    });
                }, handleResponseErrors);
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

            $scope.unselectAllPosts = function ($event) {
                $event && $event.preventDefault();
                _.forEach($scope.posts, function (post) {
                    post.selected = false;
                });
            };

            $scope.selectAllPosts = function ($event) {
                $event && $event.preventDefault();
                _.forEach($scope.posts, function (post) {
                    post.selected = true;
                });
            };

            $scope.allSelectedOnCurrentPage = function ($event) {
                return $scope.selectedItems.length === $scope.posts.length;
            };

            $scope.hasFilters = function () {
                if ($scope.filters.status !== 'all') {
                    return true;
                }
                return !_.isEmpty(_.omit(_.omit($scope.filters, 'within_km'), 'status'));
            };

            // --- start: initialization
            $scope.pageChanged = getPostsForPagination;
            $scope.currentPage = 1;
            $scope.selectedItems = [];
            $scope.itemsPerPageOptions = [10, 20, 50];
            $scope.itemsPerPage = $scope.itemsPerPageOptions[0];

            // untill we have the correct total_count value from backend request:
            $scope.totalItems = $scope.itemsPerPage;

            // Initial load
            getPostsForPagination();
        }
    ];

    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '=',
            isLoading: '='
        },
        controller: controller,
        templateUrl: 'templates/views/list.html'
    };
}];
