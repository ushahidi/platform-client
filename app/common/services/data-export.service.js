module.exports = DataExport;


DataExport.$inject = ['$rootScope', 'ConfigEndpoint', 'ExportJobEndpoint', '$q', '_', '$window', '$timeout', 'Notify', '$location'];
function DataExport($rootScope, ConfigEndpoint, ExportJobEndpoint, $q, _, $window, $timeout, Notify, $location) {

    function prepareExport(query) {
        loadingStatus(true);
        var site = ConfigEndpoint.get({ id: 'site' }).$promise;
        var exportQuery = ExportJobEndpoint.save(query);

        /**
        TODOS:
        1. Add polling to the api to check if the export-job is done,
        i.e ExportJobEndpoint.get({id}) or similar, then notify the user
        that their file is ready. 2. Keep in mind, below code will probably be changed depending on in what way the exported data is delivered
        */

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
        var message;
        if (err) {
            Notify.apiErrors(err);
        } else {
            if (status === true) {
                //TODO: Need to add cancel-job-event on button!
                message = '<p translate="notify.export.in_progress"></p><div class="buttons-export"><button class="button">Got it</button><button class="button-destructive">Cancel export</button>';
                Notify.notifyProgress(message, null, 'ellipses', 'circle-icon confirmation');
            } else {
                // TODO: Need to close when clickin on 'Got it'-button
                message = '<p translate="notify.export.complete"></p><div class="buttons-export"><button class="button">Got it</button></div>';
                Notify.notify(message, null, 'thumb-up', 'cirle-icon confirmation', false);
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
