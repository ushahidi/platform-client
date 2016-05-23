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
        templateUrl: 'templates/views/list.html'
    };
}

PostListController.$inject = [
    '$scope',
    '$q',
    '$translate',
    'PostEndpoint',
    'CollectionEndpoint',
    'Session',
    'Notify',
    '_',
    'ConfigEndpoint',
    'moment'
];
function PostListController(
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
    $scope.currentPage = 1;
    $scope.selectedPosts = [];
    $scope.itemsPerPageOptions = [10, 20, 50];
    $scope.itemsPerPage = $scope.itemsPerPageOptions[0];
    // until we have the correct total_count value from backend request:
    $scope.totalItems = $scope.itemsPerPage;

    $scope.deletePosts = deletePosts;
    $scope.exportPosts = exportPosts;
    $scope.hasFilters = hasFilters;
    $scope.itemsPerPageChanged = itemsPerPageChanged;
    $scope.userHasBulkActionPermissions = userHasBulkActionPermissions;
    $scope.pageChanged = getPostsForPagination;

    activate();

    // whenever the filters changes, update the current list of posts
    $scope.$watch(function () {
        return $scope.filters;
    }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
            getPostsForPagination();
        }
    });

    function activate() {
        // Initial load
        getPostsForPagination();
    }

    function getPostsForPagination(query) {
        query = query || $scope.filters;
        var postQuery = _.extend({}, query, {
            offset: ($scope.currentPage - 1) * $scope.itemsPerPage,
            limit: $scope.itemsPerPage
        });

        $scope.isLoading = true;
        PostEndpoint.query(postQuery).$promise.then(function (postsResponse) {
            $scope.posts = postsResponse.results;
            var now = moment(),
                yesterday = moment().subtract(1, 'days');

            $scope.groupedPosts = _.groupBy(postsResponse.results, function (post) {
                var created = moment(post.created);
                if (now.isSame(created, 'd')) {
                    return $translate.instant('nav.today');
                } else if (yesterday.isSame(created, 'd')) {
                    return $translate.instant('nav.yesterday');
                } else {
                    return created.fromNow();
                }
            });
            $scope.totalItems = postsResponse.total_count;
            $scope.isLoading = false;
        });
    }

    function deletePosts() {
        $translate('notify.post.bulk_destroy_confirm', {
            count: $scope.selectedPosts.length
        }).then(function (message) {
            Notify.showConfirmModal(message, false, 'Delete', 'delete').then(function () {

                var handleDeleteErrors = function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                },
                handleDeleteSuccess = function () {
                    $translate('notify.post.destroy_success_bulk').then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
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
        });
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

    function exportPosts() {
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
    }

    function hasFilters() {
        if ($scope.filters.status !== 'all') {
            return true;
        }
        return !_.isEmpty(_.omit(_.omit($scope.filters, 'within_km'), 'status'));
    }
}
