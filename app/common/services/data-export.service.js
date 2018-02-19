module.exports = DataExport;


DataExport.$inject = ['$rootScope', 'ConfigEndpoint', 'ExportJobEndpoint', '$q', '_', '$window', '$timeout', 'Notify', '$location', '$interval'];
function DataExport($rootScope, ConfigEndpoint, ExportJobEndpoint, $q, _, $window, $timeout, Notify, $location, $interval) {

    function startExport(query) {
        loadingStatus(true);
        ExportJobEndpoint.save(query).$promise(function (job) {
            startPolling(job);
        }, function (err) {
            loadingStatus(false, err);
        });
    }

    function startPolling(job) {
        var polling = $interval(function () {
            ExportJobEndpoint.getFresh({id: 8}).$promise.then(function (response) {
                if (response.status === 'done') {
                    // TODO: Handle url + update user
                    $interval.cancel(polling);
                } else if (response.status === 'err') {
                    // TODO: Update user
                    $interval.cancel(polling);
                }
            });
            // TODO: Do we need a timeout? How many times should we poll before we stop?
        }, 30000);

    }

    function cancelExport(jobId) {
        // TODO: Notify user that job was canceled
        ExportJobEndpoint.delete({id: jobId});
    }

    // TODO: What of below code do we need?
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
            // var URL = $window.URL || $window.webkitURL;
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
        var message, // holds the message to the user
            action, // holds info for the action-button
            icon, // holds info about icon to use in the notification
            loading; // show loading-slider or not

        if (err) {
            Notify.apiErrors(err);
        } else {
            if (status === true) {
                message = '<p translate="notify.export.in_progress">';
                action = {
                    callback: cancelExport,
                    text: 'notify.export.cancel_export',
                    actionClass: 'button-destructive'
                };
                icon = 'ellipses';
                loading = true;
            } else {
                message = '<p translate="notify.export.complete"></p>';
                icon = 'thumb-up';
                loading = false;
            }

            Notify.exportNotifications(message, null, loading, icon, 'circle-icon confirmation', action);
        }
    }

    return {
        startExport: startExport,
        startPolling: startPolling,
        showCSVResults: showCSVResults,
        handleArrayBuffer: handleArrayBuffer,
        loadingStatus: loadingStatus
    };
}
