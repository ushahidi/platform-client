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
        'ConfigEndpoint',
        'moment',
        function (
            $scope,
            $q,
            $translate,
            PostEndpoint,
            CollectionEndpoint,
            Session,
            Notify,
            _,
            ConfigEndpoint,
            moment
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
                    var now = moment();
                    $scope.groupedPosts = _.groupBy(postsResponse.results, function (post) {
                        var created = moment(post.created);
                        // @todo translate today
                        return now.isSame(created, 'd') ? 'Today' : created.fromNow();
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

            $scope.exportPosts = function () {
                $translate('notify.post.export').then(function (message) {
                    Notify.showConfirm(message).then(function (message) {
                        var filters = {},
                            format = 'csv'; //@todo handle more formats

                        // Prepare filters for export
                        angular.extend(filters, $scope.filters, {format: format});

                        var site = ConfigEndpoint.get({ id: 'site' }).$promise,
                            postExport = PostEndpoint.export(filters);

                        // Save export data to file
                        $q.all([site, postExport]).then(function (response) {
                            var filename = response[0].name + '.' + format,
                                data = response[1].data;

                            // Create anchor link
                            var anchor = angular.element('<a/>');

                            // ...and attach it.
                            angular.element(document.body).append(anchor);

                            // Set attributes
                            anchor.attr({
                                href: 'data:attachment/' + format + ';charset=utf-8,' + encodeURIComponent(data),
                                download: filename
                            });

                            // Show file download dialog
                            anchor[0].click();

                            // ... and finally remove the link
                            anchor.remove();
                        });
                    });
                });
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
