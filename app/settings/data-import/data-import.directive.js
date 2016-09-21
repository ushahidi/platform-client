module.exports = [
    '$translate',
    '$rootScope',
    '$q',
    '$location',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    'DataImportEndpoint',
    'Notify',
    'ImportNotify',
    'Features',
    '_',
function (
    $translate,
    $rootScope,
    $q,
    $location,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    DataImportEndpoint,
    Notify,
    ImportNotify,
    Features,
    _
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.selectedForm;
            $scope.activeStep = 1;
            $scope.stepOneComplete = false;
            $scope.stepTwoComplete = false;
            $scope.maps_to = {};
            $scope.required_fields = [];
            $scope.required_fields_map = {};
            $scope.hasRequiredTask = false;

            Features.loadFeatures().then(function () {
                $scope.csvEnabled = Features.isFeatureEnabled('data-import');
            });

            $scope.setSelectedForm = function (form) {
                $scope.selectedForm = form;
            };

            $scope.isSelectedForm = function (form) {
                if ($scope.selectedForm) {
                    return $scope.selectedForm.id === form.id;
                }
                return false;
            };

            $scope.cancelImport = function () {
                Notify.notify('notify.data_import.csv_import_cancel');

                $scope.deleteDataImport($scope.csv);
                $location.url('/settings/data-import/');
            };

            $scope.deleteDataImport = function () {
                DataImportEndpoint.delete($scope.csv);
            };

            $scope.isActiveStep = function (step) {
                return $scope.activeStep === step;
            };

            $scope.completeStepOne = function () {
                if (!$scope.fileContainer.file) {
                    Notify.error('notify.data_import.file_missing');
                    return;
                }

                if (!$scope.selectedForm) {
                    Notify.error('notify.data_import.form_missing');
                    return;
                }
                var formData = new FormData();
                formData.append('file', $scope.fileContainer.file);
                formData.append('form_id', $scope.selectedForm.id);

                DataImportEndpoint.upload(formData)
                .then(function (csv) {
                    Notify.notify('notify.data_import.csv_upload', {name: $scope.fileContainer.file.name});
                    $scope.stepOneComplete = true;
                    $scope.activeStep = 2;
                    $scope.csv = csv;

                    // Retrieve tasks and attributes
                    $q.all([
                        FormStageEndpoint.get({form_id: $scope.selectedForm.id}).$promise,
                        FormAttributeEndpoint.get({form_id: $scope.selectedForm.id}).$promise
                    ]).then(function (results) {
                        $scope.selectedForm.tasks = results[0].results;
                        $scope.selectedForm.attributes = results[1].results;

                        // Split locations into lat/lon
                        var points = _.chain($scope.selectedForm.attributes)
                            .where({'type' : 'point'})
                            .reduce(function (collection, item) {
                                return collection.concat(
                                    {
                                        key: item.key + '.lat',
                                        label: item.label + ' (Latitude)',
                                        priority: item.priority,
                                        required: item.required
                                    }, {
                                        key: item.key + '.lon',
                                        label: item.label + ' (Longitude)',
                                        priority: item.priority,
                                        required: item.required
                                    }
                                );
                            }, [])
                            .value();

                        $scope.selectedForm.attributes  = _.chain($scope.selectedForm.attributes)
                            .reject({type : 'point'})
                            .concat(points)
                            // Add in the Post specific mappable fields
                            .push({
                                    'key': 'title',
                                    'label': $translate.instant('post.modify.form.title'),
                                    'priority': 0,
                                    'required': true
                                },
                                {
                                    'key': 'content',
                                    'label': $translate.instant('post.modify.form.description'),
                                    'priority': 1,
                                    'required': true
                                },
                                {
                                    'key': 'tags',
                                    'label': $translate.instant('post.modify.form.categories'),
                                    'priority': 2
                                }
                            )
                            .sortBy('priority')
                            .value();

                        _.each($scope.selectedForm.attributes, function (attribute, index) {
                            if (attribute.required) {
                                $scope.required_fields.push(attribute.key);
                                $scope.required_fields_map[attribute.key] = attribute.label;
                            }
                        });

                        _.each($scope.selectedForm.tasks, function (task) {
                            if (task.required) {
                                $scope.hasRequiredTask = true;
                            }
                        });
                    });
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

            // Check for missing required fields and return the missing fields
            $scope.checkRequiredFields = function (fields) {
                var missing = [];
                var difference = _.difference($scope.required_fields, _.toArray(fields));

                if (!_.isEmpty(difference)) {
                    _.each(difference, function (field) {
                        missing.push(
                            $scope.required_fields_map[field]
                        );
                    });
                }

                return missing;
            };

            $scope.remapColumns = function () {
                var map = _.clone($scope.maps_to);
                // First we invert the mappings so they are in terms of csv column
                // indices
                map = _.invert(map);

                // Then we set null values for unmapped columns
                var keys = _.keys(map);
                _.each($scope.csv.columns, function (column, index) {
                    map[index] = _.contains(keys, index.toString()) ? map[index] : null;
                });

                return map;
            };

            $scope.checkForDuplicates = function () {
                // Check to make sure the user hasn't double mapped a key
                // First, collect the counts for all keys
                return _.chain($scope.maps_to)
                            .map(function (item) {
                                return $scope.csv.columns[item];
                            })
                            .countBy(function (item) {
                                return item;
                            })
                            .pick(function (value, key) {
                                return value > 1;
                            })
                            .allKeys()
                            .value();
            };

            $scope.completeStepTwo = function () {
                // First we must remap the csv.maps_to array so that
                // it is in terms of csv column indexes

                $scope.csv.maps_to = $scope.remapColumns();

                if (_.every($scope.csv.maps_to, _.isEmpty)) {
                    Notify.error('notify.data_import.no_mappings');
                    return;
                }

                var duplicateVars = $scope.checkForDuplicates();

                // third, warn the user which keys have been duplicated
                if (duplicateVars.length > 0) {
                    Notify.error('notify.data_import.duplicate_fields', {duplicates: duplicateVars.join(', ')});
                    return;
                }

                //Check required fields are set
                var missing = $scope.checkRequiredFields($scope.csv.maps_to);
                if (!_.isEmpty(missing)) {
                    Notify.error('notify.data_import.required_fields', {required: missing.join(', ')});
                    return;
                }

                $scope.csv.fixed = {
                    'form': $scope.selectedForm.id
                };

                // Check if status has been set
                if ($scope.selectedStatus) {
                    if ($scope.isStatusOption('mark_as')) {
                        // If status explicitly set
                        $scope.csv.fixed.status = $scope.selectedStatus;
                    } else {
                        // If status set by csv column mapping
                        $scope.csv.maps_to[$scope.selectedStatus] = 'status';
                    }

                }

                updateAndImport($scope.csv);

            };

            function updateAndImport(csv) {
                DataImportEndpoint.update(csv).$promise
                    .then(function () {
                        DataImportEndpoint.import({id: csv.id, action: 'import'}).$promise
                            .then(function (response) {
                                var processed = response.processed,
                                    errors = response.errors;

                                ImportNotify.importComplete(
                                {
                                    processed: processed,
                                    errors: errors,
                                    form_name: $scope.selectedForm.name,
                                    filename: csv.filename
                                });

                                $rootScope.$emit('event:import:complete', {form: $scope.form, filename: csv.filename});

                            }, function (errorResponse) {
                                Notify.apiErrors(errorResponse);
                            });
                    }, function (errorResponse) {
                        Notify.apiErrors(errorResponse);
                    });
                // Go to after import page
                $location.url('/settings/data-after-import');
            }

            $scope.setStatus = function (status) {
                $scope.selectedStatus = status;
            };

            $scope.setStatusOption = function (option) {
                $scope.statusOption = option;
            };

            $scope.isStatusOption = function (option) {
                return $scope.statusOption === option;
            };

            $scope.isChecked = function (status) {
                return $scope.selectedStatus === status;
            };

        }
    };
}];
