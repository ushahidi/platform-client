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
        'FormAttributeEndpoint',
        'MediaEndpoint',
        function (
            $scope,
            $q,
            $translate,
            PostEndpoint,
            CollectionEndpoint,
            Session,
            Notify,
            _,
            FormAttributeEndpoint,
            MediaEndpoint
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

                    // Show image with post listing
                    angular.forEach($scope.posts, function (post) {
                        if (_.isUndefined(post.form)) {
                            return;
                        }

                        FormAttributeEndpoint.query({ formId: post.form.id}, function (attributes) {
                            // Use image from the first media attribute
                            var mediaAttribute = _.find(attributes, function (attribute) {
                                return attribute.type === 'media';
                            });

                            // Get the media url and caption
                            if (!_.isUndefined(post.values[mediaAttribute.key])) {
                                MediaEndpoint.get({ id: post.values[mediaAttribute.key] }, function (media) {
                                    post.media = {
                                        url: media.original_file_url,
                                        caption: media.caption
                                    };
                                });
                            }
                        });
                    });

                    $scope.totalItems = postsResponse.total_count;
                    $scope.isLoading = false;
                });
            },
            handleResponseErrors = function (errorResponse) {
                Notify.showApiErrors(errorResponse);
            },
            handleSuccess = function () {
                $translate('notify.post.destroy_success_bulk').then(function (message) {
                    Notify.showNotificationSlider(message);
                });
            };


            // whenever the filters changes, update the current list of posts
            $scope.$watch(function () {
                return $scope.filters;
            }, function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    getPostsForPagination();
                }
            });

            $scope.$on('event:post:selection', function (event, post) {
                (post.selected ? $scope.selectedItems++ : $scope.selectedItems--);
                (post.selected ? $scope.selectedPosts.push(post) : $scope.selectedPosts = _.without($scope.selectedPosts, _.findWhere($scope.selectedPosts, {id: post.id})));
            });

            $scope.deleteSelectedPosts = function () {

                $translate('notify.post.destroy_confirm').then(function (message) {
                    Notify.showConfirm(message).then(function () {
                        // ask server to delete selected posts
                        // and refetch posts from server
                        var deletePostsPromises = _.map(
                            $scope.selectedPosts,
                            function (post) {
                                $scope.selectedPosts = _.without($scope.selectedPosts, _.findWhere($scope.selectedPosts, {id: post.id}));
                                $scope.selectedItems--;
                                return PostEndpoint.delete({ id: post.id }).$promise;
                            });
                        $q.all(deletePostsPromises).then(handleSuccess, handleResponseErrors)
                        .finally(getPostsForPagination);
                    });
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

            $scope.unselectAllPosts = function ($event) {
                $event && $event.preventDefault();
                _.forEach($scope.posts, function (post) {
                    post.selected = false;
                    $scope.selectedPosts = _.without($scope.selectedPosts, _.findWhere($scope.selectedPosts, {id: post.id}));
                    $scope.selectedItems--;
                });
            };

            $scope.selectAllPosts = function ($event) {
                $event && $event.preventDefault();
                _.forEach($scope.posts, function (post) {
                    post.selected = true;
                    $scope.selectedPosts.push(post);
                    $scope.selectedItems++;
                });
            };

            $scope.allSelectedOnCurrentPage = function ($event) {
                return $scope.selectedItems === $scope.posts.length;
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
            $scope.selectedItems = 0;
            $scope.selectedPosts = [];
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
