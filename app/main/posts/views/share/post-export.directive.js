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
    this.getQuery = getQuery;
    this.prepareExport = prepareExport;
    this.showCSVResults = showCSVResults;
    this.requestExport = requestExport;
    $scope.exportPostsConfirmation = function () {
        /**
         * Trigger confirm notification for user.
         * When the user accepts, get the CSV
         */
        Notify.confirm('notify.post.export').then(function (message) {
            prepareExport();
        });
    };
    function prepareExport() {
        loadingStatus(true);
        var site = ConfigEndpoint.get({ id: 'site' }).$promise;
        var query = getQuery();
        var exportQuery = PostEndpoint.export(query);
        requestExport(site, query, exportQuery);
    }

    function requestExport(site, query, exportQuery) {
        $q.all([site, exportQuery]).then(function (response) {
            showCSVResults(response, query.format);
        }).finally(function (response) {
            loadingStatus(false);
        });
    }
    function loadingStatus(status) {
        if (status === true) {
            $scope.loading = true;
            Notify.notifyProgress('<br><h3 translate="notify.export.in_progress">Your CSV export is in progress...</h3><br>');
        } else {
            $scope.loading = false;
            Notify.notify('<h3 translate="notify.export.complete">Your CSV export is complete.</h3><p translate="notify.export.complete_data_found_message">The data from your export can be found in your browser\'s downloads<p>');
        }
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
        loadingStatus(false);
    }

}
