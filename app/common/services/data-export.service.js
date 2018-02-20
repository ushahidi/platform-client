module.exports = DataExport;


DataExport.$inject = ['ExportJobEndpoint', 'Notify', '$window', '$timeout', '$interval', 'CONST'];
function DataExport(ExportJobEndpoint,  Notify, $window, $timeout, $interval, CONST) {

    function startExport(query) {
        query.entity_type = 'post';
        ExportJobEndpoint.save(query).$promise.then(function (job) {
            loadingStatus(true, null, job.id);
            startPolling(job);
        }, function (err) {
            loadingStatus(false, err);
        });
    }

    function startPolling(job) {
        var polling = $interval(function () {
            // TODO: Question: Should we also delete the job after the job is done/failed?
            ExportJobEndpoint.getFresh({id: job.id}).$promise.then(function (response) {
                if (response.status === 'done') {
                    // when job is done, we stop the polling...
                    $interval.cancel(polling);
                    // ..and download the file
                    downloadFile(response.url);
                    // finally we notify the user
                    loadingStatus(false);
                }
            }, function (err) {
                    // if there is an error while exporting we stop the polling
                    $interval.cancel(polling);
                    // and notify the user
                    Notify.apiErrors(err);
                }
            );
        }, CONST.EXPORT_POLLING_INTERVAL, CONST.EXPORT_POLLING_COUNT);

    }

    function cancelExport(jobId) {
        ExportJobEndpoint.delete({id: jobId});
    }

    function downloadFile(downloadUrl) {
        var URL = $window.URL || $window.webkitURL;
        // Create anchor link
        var anchor = angular.element('<a/>');
        anchor.attr({
            href: downloadUrl
        });
        // download file
        angular.element(document.body).append(anchor);
        anchor[0].click();
        anchor[0].remove();
        // TODO: Question, is below needed? Its from the old code but I am not sure what it does?
        $timeout(function () {
            URL.revokeObjectURL(downloadUrl);
        }, 100); // cleanup
    }

    function loadingStatus(status, err, job) {
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
                    actionClass: 'button-destructive',
                    callbackArg: job.id
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
        startExport: startExport
    };
}
