module.exports = DataExport;

DataExport.$inject = ['$rootScope', 'ConfigEndpoint', 'PostEndpoint', '$q', '_', '$window', '$timeout', 'Notify', '$location'];
function DataExport($rootScope, ConfigEndpoint, PostEndpoint, $q, _, $window, $timeout, Notify, $location) {
    function prepareExport(query) {
        loadingStatus(true);
        var site = ConfigEndpoint.get({ id: 'site' }).$promise;
        var exportQuery = PostEndpoint.export(query);
        requestExport(site, query, exportQuery);
    }
    function requestExport(site, query, exportQuery) {
        $q.all([site, exportQuery]).then(function (response) {

            showCSVResults(response, query.format);
        }, function (err) {
            loadingStatus(false, err);
        });
    }
    function showCSVResults(response, format) {
        // Save export data to file
        var filename = response[0].name + '-' + (new Date()).toISOString().substring(0, 10) + '.' + format,
            data = response[1].data;

        handleArrayBuffer(filename, data, 'csv');
        loadingStatus(false);
        $rootScope.$broadcast('event:data_export:complete');
        return filename;
    }

    function handleArrayBuffer(filename, data, type) {
        /**
         * If we have the HTML5 Api for File available we use that. If not, a Blob
         */
        function createCSVFile() {
            if (_.isFunction(File)) {
                return new File([data], filename, { type: type });
            } else {
                return new Blob([data], { type: type });
            }
        }
        var blob = createCSVFile();
        if (!_.isUndefined($window.navigator.msSaveBlob)) {
            /** IE specific workaround for "HTML7007"
             * https://stackoverflow.com/questions/20310688/blob-download-not-working-in-ie
            **/
            $window.navigator.msSaveBlob(blob, filename);
        } else {
            var URL = $window.URL || $window.webkitURL;
            var downloadUrl = URL.createObjectURL(blob);
            if (filename) {
                // use HTML5 a[download] attribute to specify filename
                // Create anchor link
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: downloadUrl,
                    download: filename
                });
                angular.element(document.body).append(anchor);
                anchor[0].click();
                anchor[0].remove();
            } else {
                $location.url(downloadUrl);
            }

            $timeout(function () {
                URL.revokeObjectURL(downloadUrl);
            }, 100); // cleanup

        }
    }

    function loadingStatus(status, err) {
        if (err) {
            Notify.apiErrors(err);
        } else {
            if (status === true) {
                Notify.notifyProgress('<p translate="notify.export.in_progress"></p>');
            } else {
                Notify.notify('<h3 translate="notify.export.complete">Your CSV export is complete.</h3><p translate="notify.export.complete_data_found_message">The data from your export can be found in your browser\'s downloads<p>');
            }
        }
    }

    return {
        prepareExport: prepareExport,
        requestExport: requestExport,
        showCSVResults: showCSVResults,
        handleArrayBuffer: handleArrayBuffer,
        loadingStatus: loadingStatus
    };
}
