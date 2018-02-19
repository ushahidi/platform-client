module.exports = PostExportDirective;

PostExportDirective.$inject = [];
function PostExportDirective() {
    return {
        restrict: 'E',
        scope: {
            filters: '='
        },
        controller: PostExportController,
        template: require('./post-export.html')
    };
}

PostExportController.$inject = [
    '$scope',
    'Notify',
    'PostFilters',
    '_',
    'DataExport'
];
function PostExportController(
    $scope,
    Notify,
    PostFilters,
    _,
    DataExport
) {
    $scope.getQuery = getQuery;

    $scope.exportPostsConfirmation = function () {
        /**
         * Trigger confirm notification for user.
         * When the user accepts, get the CSV
         */
        Notify.confirm('notify.post.export').then(function (message) {
            DataExport.startExport(getQuery());
        });
    };

    function getQuery() {
        /**
         * If the filters are not available, apply the defaults
         */
        if (!$scope.filters || _.isEmpty($scope.filters)) {
            $scope.filters = PostFilters.getDefaults();
        }
        // Prepare filters for export
        var entity_type = 'post';
        var query = {
            filters: PostFilters.getQueryParams($scope.filters),
            entity_type: entity_type
        };
        return query;
    }
}
