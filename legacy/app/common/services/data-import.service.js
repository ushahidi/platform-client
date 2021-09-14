module.exports = DataImport;

DataImport.$inject = [
    '$rootScope',
    'DataImportEndpoint',
    'Notify',
    '$window',
    '$timeout',
    '$interval',
    'CONST',
    '$q',
    '_',
    'ImportNotify',
    'CollectionEndpoint'
];
function DataImport(
    $rootScope,
    DataImportEndpoint,
    Notify,
    $window,
    $timeout,
    $interval,
    CONST,
    $q,
    _,
    ImportNotify,
    CollectionEndpoint
) {
    var importJobs = [];

    function startImport(job) {
        startPolling([DataImportEndpoint.getFresh({id: job.id}).$promise]);
    }

    function loadImportJob() {
        var queries = [];
        DataImportEndpoint.queryFresh().$promise.then(function (response) {
            _.each(response, function (job) {
                if (job.status !== 'SUCCESS' && job.status !== 'FAILED') {
                    queries.push(DataImportEndpoint.getFresh({id: job.id}).$promise);
                }
            });
            if (queries.length) {
                startPolling(queries);
            }
        });
    }

    function loadImportJobs() {
        return DataImportEndpoint.queryFresh().$promise;
    }

    function startPolling(queries) {
        var timer,
            nextQuery = [];
        timer = $timeout(function () {
            $q.all(queries).then(function (response) {
                _.each(response, function (job) {
                    if (job.status === 'SUCCESS') {
                        var processed = job.processed,
                            collectionId = job.collection_id,
                            errors = job.errors;

                        ImportNotify.importComplete(
                        {
                            processed: processed,
                            errors: errors,
                            collectionId: collectionId,
                            filename: job.filename
                        });

                        $rootScope.$emit('event:import:complete', {filename: job.filename, collectionId: collectionId});

                        updateImportJobsList(job);
                    } else if (job.status === 'FAILED') {
                        // when job is failed, we stop the polling...
                        $rootScope.$broadcast('event:import_job:stopped');
                        // ..and notify user that it has failed
                        var error_message = 'import job has failed.';
                        loadingStatus(false, error_message);
                        updateImportJobsList(job);
                    } else {
                        // add the job to the poll until job is done
                        nextQuery.push(DataImportEndpoint.getFresh({id: job.id}).$promise);
                    }
                });
                // if there are pending jobs, we poll for them again
                if (nextQuery.length > 0) {
                    startPolling(nextQuery);
                }
            }, function (err) {
                    // if there is an error while importing we stop the polling
                    $rootScope.$broadcast('event:import_job:stopped');
                    // and notify the user
                    Notify.apiErrors(err);
                }
            );
        }, CONST.EXPORT_POLLING_INTERVAL);
        $rootScope.$on('event:authentication:logout:succeeded', function () {
            $timeout.cancel(timer);
        });
    }

    function updateImportJobsList(job) {
        var _importJobs = getImportJobs();
        const foundJobIndex = _.findIndex(_importJobs, (_job) => {
            return _job.id === job.id;
        });

        if (foundJobIndex >= 0) {
            _importJobs[foundJobIndex] = job;
        } else {
            _importJobs.push(processJobFields(job));
        }
        _importJobs = processImportJobs(_importJobs);
        setImportJobs(_importJobs);
        $rootScope.$broadcast('importJobs:updated', _importJobs);
    }

    function loadingStatus(status, err, job) {
        // var message, // holds the message to the user
        //     action, // holds info for the action-button
        //     icon, // holds info about icon to use in the notification
        //     loading; // show loading-slider or not

        // if (err) {
        //     Notify.apiErrors(err);
        // } else {
        //     if (status === true) {
        //         message = '<p translate="notify.import.in_progress">';
        //         action = {
        //             callback: cancelimport,
        //             text: 'notify.import.cancel_import',
        //             actionClass: 'button-destructive',
        //             callbackArg: job.id
        //         };
        //         icon = 'ellipses';
        //         loading = true;
        //     } else {
        //         message = '<p translate="notify.import.complete"></p>';
        //         icon = 'thumb-up';
        //         loading = false;
        //     }

        //     Notify.notifyAction(message, null, loading, icon, 'circle-icon confirmation', action);
        // }
    }

    function processJobFields(job) {
        if (job.status) {
            job.status = job.status.toLowerCase();
        }
        return job;
    }

    function processImportJobs(jobs) {
        let _jobs = _.filter(_.map(jobs, (job) => {
            return processJobFields(job);
        }));
        _jobs = _.sortBy(jobs, (job) => {
            return job.created_timestamp;
        }).reverse();
        return _jobs;
    }

    function getImportJobs() {
        return importJobs;
    }

    function setImportJobs(_importJobs) {
        importJobs = _importJobs;
    }

    return {
        startImport: startImport,
        loadImportJob: loadImportJob,
        loadImportJobs: loadImportJobs,
        processImportJobs: processImportJobs,
        setImportJobs: setImportJobs,
        getImportJobs: getImportJobs
    };
}
