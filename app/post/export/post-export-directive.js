module.exports = PostExportDirective;

PostExportDirective.$inject = [];
function PostExportDirective() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            filters: '='
        },
        controller: PostExportController,
        templateUrl: 'templates/posts/export/post-export.html'
    };
}

PostExportController.$inject = [
    '$scope',
    '$translate',
    'PostEndpoint',
    'ConfigEndpoint',
    'Notify',
    '$q'
];
function PostExportController(
    $scope,
    $translate,
    PostEndpoint,
    ConfigEndpoint,
    Notify,
    $q
) {

    $scope.exportPosts = exportPosts;

    function exportPosts() {
        Notify.confirm('notify.post.export').then(function (message) {
            var filters = {},
                format = 'csv'; //@todo handle more formats

            // Prepare filters for export
            angular.extend(filters, $scope.filters, {format: format});

            // @todo Do we need this for export?
            delete filters.user;

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
    }
}
