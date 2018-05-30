module.exports = DataExport;

DataExport.$inject = ['$rootScope', 'ExportJobEndpoint', 'Notify', '$window', '$timeout', '$interval', 'CONST', '$q', '_'];
function DataExport($rootScope, ExportJobEndpoint,  Notify, $window, $timeout, $interval, CONST, $q, _) {
    var exportJobs = [];
    function startExport(query) {
        query.entity_type = 'post';

        // saving the new job to the db
        ExportJobEndpoint.save(query).$promise.then(function (job) {
            updateExportJobsList(job);
            // notifies the user
            loadingStatus(true, null, job);
            // start polling for ready job.
            startPolling([ExportJobEndpoint.getFresh({id: job.id})]);
        }, function (err) {
            loadingStatus(false, err);
        });
    }

    function loadExportJob() {
        var queries = [];
        ExportJobEndpoint.queryFresh({user: 'me'}).$promise.then(function (response) {
            _.each(response, function (job) {
                if (job.status !== 'SUCCESS' && job.status !== 'FAILED') {
                    queries.push(ExportJobEndpoint.getFresh({id: job.id}));
                }
            });
            startPolling(queries);
        });
    }

    function loadExportJobs() {
        return ExportJobEndpoint.queryFresh({user: 'me', max_expiration: Math.round((new Date()).getTime() / 1000)}).$promise;
    }

    function startPolling(queries) {
        var timer,
            nextQuery = [];
        timer = $timeout(function () {
            $q.all(queries).then(function (response) {
                _.each(response, function (job) {
                    if (job.status === 'SUCCESS') {
                        // when job is successful, we stop the polling...
                        $rootScope.$broadcast('event:export_job:stopped');
                        // ..and download the file
                        downloadFile(job.url);
                        updateExportJobsList(job);
                    } else if (job.status === 'FAILED') {
                        // when job is failed, we stop the polling...
                        $rootScope.$broadcast('event:export_job:stopped');
                        // ..and notify user that it has failed
                        var error_message = 'Export job has failed.';
                        loadingStatus(false, error_message);
                        updateExportJobsList(job);
                    } else {
                        // add the job to the poll until job is done
                        nextQuery.push(ExportJobEndpoint.getFresh({id: job.id}));
                    }
                });
                // if there are pending jobs, we poll for them again
                if (nextQuery.length > 0) {
                    startPolling(nextQuery);
                }
            }, function (err) {
                    // if there is an error while exporting we stop the polling
                    $rootScope.$broadcast('event:export_job:stopped');
                    // and notify the user
                    Notify.apiErrors(err);
                }
            );
        }, CONST.EXPORT_POLLING_INTERVAL);
        $rootScope.$on('event:authentication:logout:succeeded', function () {
            $timeout.cancel(timer);
        });
    }

    function updateExportJobsList(job) {
        var _exportJobs = getExportJobs();
        const foundJobIndex = _.findIndex(_exportJobs, (_job) => {
            return _job.id === job.id;
        });

        if (foundJobIndex >= 0) {
            _exportJobs[foundJobIndex] = job;
        } else {
            _exportJobs.push(processJobFields(job));
        }
        _exportJobs = processExportJobs(_exportJobs);
        setExportJobs(_exportJobs);
        $rootScope.$broadcast('exportJobs:updated', _exportJobs);
    }

    function cancelExport(jobId) {
        ExportJobEndpoint.delete({id: jobId});
        $rootScope.$broadcast('event:export_job:stopped');
        Notify.notify('<p translate="notify.export.canceled_job"></p>');
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
        // we notify the user
        loadingStatus(false);

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

            Notify.notifyAction(message, null, loading, icon, 'circle-icon confirmation', action);
        }
    }

    function processJobFields(job) {
        if (job.status) {
            /**
             * only chhange the job.url_expiration if its a number or empty,
             * to avoid "invalid date" from multiple conversions
             */

            if (!job.url_expiration) {
                job.url_expiration = '';
            } else if (_.isNumber(job.url_expiration)) {
                job.url_expiration = new Date(job.url_expiration * 1000).toLocaleString();
            }
            // keep the original timestamp for sorting
            job.created_timestamp = job.created_timestamp ? job.created_timestamp : job.created;
            job.created = new Date(job.created).toLocaleString();
            job.status = job.status.toLowerCase();
        }
        return job;
    }

    function processExportJobs(jobs) {
        let _jobs = _.filter(_.map(jobs, (job) => {
            return processJobFields(job);
        }));
        _jobs = _.sortBy(jobs, (job) => {
            return job.created_timestamp;
        }).reverse();
        return _jobs;
    }

    function getExportJobs() {
        return exportJobs;
    }

    function setExportJobs(_exportJobs) {
        exportJobs = _exportJobs;
    }

    return {
        startExport: startExport,
        loadExportJob: loadExportJob,
        loadExportJobs: loadExportJobs,
        processExportJobs: processExportJobs,
        setExportJobs: setExportJobs,
        getExportJobs: getExportJobs
    };
}
