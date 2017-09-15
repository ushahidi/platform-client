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
    '$translate',
    'PostEndpoint',
    'ConfigEndpoint',
    'Notify',
    '$q',
    'PostFilters',
    '_'
];
function PostExportController(
    $scope,
    $translate,
    PostEndpoint,
    ConfigEndpoint,
    Notify,
    $q,
    PostFilters,
    _
) {
    $scope.loading = false;
    $scope.exportPostsConfirmation = function () {
        /**
         * Trigger confirm notification for user.
         * When the user accepts, get the CSV
         */
        Notify.confirm('notify.post.export').then(function (message) {
            prepareExport();
        });
    };
    this.getQuery = getQuery;
    this.prepareExport = prepareExport;
    this.showCSVResults = showCSVResults;
    this.requestExport = requestExport;

    function prepareExport() {
        $scope.loading = true;
        var site = ConfigEndpoint.get({ id: 'site' }).$promise;
        var query = getQuery();
        var exportQuery = PostEndpoint.export(query);
        requestExport(site, query, exportQuery);
    }

    function requestExport(site,query,exportQuery) {
        $q.all([site, exportQuery]).then(function (response) {
            showCSVResults(response, query.format);
        }).finally(function (response) {
            $scope.loading = false;
        });
    }

    function getQuery() {
        /**
         * If the filters are not available, apply the defaults
         */
        if (!$scope.filters || _.isEmpty($scope.filters)) {
            $scope.filters = PostFilters.getDefaults();
        }
        var format = 'csv';  //@todo handle more formats
        // Prepare filters for export
        var query = angular.extend({}, PostFilters.getQueryParams($scope.filters), {
            format: format
        });
        return query;
    }

    function showCSVResults(response, format) {
        // Save export data to file
        var filename = response[0].name + '-' + (new Date()).toISOString().substring(0, 10) + '.' + format,
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
        $scope.loading = false;
    }

}
