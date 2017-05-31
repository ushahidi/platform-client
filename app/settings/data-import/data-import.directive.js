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
    'CollectionEndpoint',
    'moment',
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
    CollectionEndpoint,
    moment,
    _
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {

            $scope.setStatus = setStatus;
            $scope.setStatusOption = setStatusOption;
            $scope.isStatusOption = isStatusOption;
            $scope.isStatusSelected = isStatusSelected;
            $scope.setSelectedForm = setSelectedForm;
            $scope.isSelectedForm = isSelectedForm;
            $scope.cancelImport = cancelImport;
            $scope.deleteDataImport = deleteDataImport;
            $scope.isActiveStep = isActiveStep;
            $scope.completeStepOne = completeStepOne;
            $scope.completeStepTwo = completeStepTwo;

            activate();

            function activate() {
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
            }

            function setStatus(status) {
                $scope.selectedStatus = status;
            }

            function setStatusOption(option) {
                $scope.statusOption = option;
            }

            function isStatusOption(option) {
                return $scope.statusOption === option;
            }

            function isStatusSelected(status) {
                return $scope.selectedStatus === status;
            }

            function setSelectedForm(form) {
                $scope.selectedForm = form;
            }

            function isSelectedForm(form) {
                if ($scope.selectedForm) {
                    return $scope.selectedForm.id === form.id;
                }
                return false;
            }

            function cancelImport() {
                Notify.confirm('notify.data_import.csv_import_cancel_confirm').then(function () {
                    Notify.notify('notify.data_import.csv_import_cancel');
                    deleteDataImport($scope.csv);
                    $location.url('/settings/data-import/');
                });
            }

            function deleteDataImport() {
                DataImportEndpoint.delete($scope.csv);
            }

            function isActiveStep(step) {
                return $scope.activeStep === step;
            }

            function completeStepOne() {
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

                    loadStepTwo();
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            }

            function loadStepTwo(results) {
                // Retrieve tasks and attributes
                $q.all([
                    FormStageEndpoint.getFresh({form_id: $scope.selectedForm.id}).$promise,
                    FormAttributeEndpoint.getFresh({form_id: $scope.selectedForm.id}).$promise
                ]).then(function (results) {
                    $scope.selectedForm.tasks = results[0].results;
                    $scope.selectedForm.attributes  = transformAttributes(results[1].results);
                    setRequiredFields($scope.selectedForm.attributes);
                    setRequiredTasks($scope.selectedForm.tasks);
                });
            }

            function transformAttributes(attributes) {
                // Split locations into lat/lon
                var points = _.chain(attributes)
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

                var titleAttr = _.find(attributes, { type: 'title' });
                var descAttr = _.find(attributes, { type: 'description' });

                var titleLabel = titleAttr ? titleAttr.label : $translate.instant('post.modify.form.title');
                var descLabel = descAttr ? descAttr.label : $translate.instant('post.modify.form.description');

                attributes = _.chain(attributes)
                    .reject({type : 'point'})
                    .reject({type : 'title'})
                    .reject({type : 'description'})
                    .concat(points)
                    // Add in the Post specific mappable fields
                    .push({
                            'key': 'title',
                            'label': titleLabel,
                            'priority': 0,
                            'required': true
                        },
                        {
                            'key': 'content',
                            'label': descLabel,
                            'priority': 1,
                            'required': true
                        }
                    )
                    .sortBy('priority')
                    .value();
                return attributes;
            }

            function setRequiredTasks(tasks) {
                _.each(tasks, function (task) {
                    if (task.required) {
                        $scope.hasRequiredTask = true;
                    }
                });
            }

            function setRequiredFields(attributes) {
                _.each(attributes, function (attribute, index) {
                    if (attribute.required) {
                        $scope.required_fields.push(attribute.key);
                        $scope.required_fields_map[attribute.key] = attribute.label;
                    }
                });
            }

            function completeStepTwo() {
                // First we must remap the csv.maps_to array so that
                // it is in terms of csv column indexes
                $scope.csv.maps_to = remapColumns();
                if (!validateCSV()) {
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

            }

            function validateCSV() {
                var csvIsValid = true;

                if (_.every($scope.csv.maps_to, _.isEmpty)) {
                    Notify.error('notify.data_import.no_mappings');
                    return false;
                }

                var duplicateVars = checkForDuplicates();

                // third, warn the user which keys have been duplicated
                if (duplicateVars.length > 0) {
                    Notify.error('notify.data_import.duplicate_fields', {duplicates: duplicateVars.join(', ')});
                    return false;
                }

                //Check required fields are set
                var missing = checkRequiredFields($scope.csv.maps_to);
                if (!_.isEmpty(missing)) {
                    Notify.error('notify.data_import.required_fields', {required: missing.join(', ')});
                    return false;
                }

                return csvIsValid;
            }

            function createPostCollection(post_ids) {
                var deferred = $q.defer();

                var now = moment().format('h:mm a MMM Do YYYY');

                var collection = {};
                collection.name = 'Imported ' + now;
                collection.view = 'list';
                collection.visible_to = ['admin'];
                var calls = [];
                CollectionEndpoint.save(collection).$promise.then(function (collection) {
                    _.each(post_ids, function (id) {
                        calls.push(
                            CollectionEndpoint.addPost({'collectionId': collection.id, 'id': id})
                        );
                    });
                    $q.all(calls).then(function () {
                        deferred.resolve(collection);
                    });
                });
                return deferred.promise;
            }

            function updateAndImport(csv) {
                DataImportEndpoint.update(csv).$promise
                    .then(function () {
                        DataImportEndpoint.import({id: csv.id, action: 'import'}).$promise
                            .then(function (response) {
                                var processed = response.processed,
                                    errors = response.errors,
                                    post_ids = response.created_ids;

                                createPostCollection(post_ids).then(function (collection) {
                                    ImportNotify.importComplete(
                                    {
                                        processed: processed,
                                        errors: errors,
                                        collectionId: collection.id,
                                        form_name: $scope.selectedForm.name,
                                        filename: csv.filename
                                    });

                                    $rootScope.$emit('event:import:complete', {form: $scope.form, filename: csv.filename, collectionId: collection.id});
                                });
                            }, function (errorResponse) {
                                Notify.apiErrors(errorResponse);
                            });
                    }, function (errorResponse) {
                        Notify.apiErrors(errorResponse);
                    });
                // Go to after import page
                $location.url('/settings/data-after-import');
            }

            // Check for missing required fields and return the missing fields
            function checkRequiredFields(fields) {
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
            }

            function remapColumns() {
                var map = _.clone($scope.maps_to);
                // First we invert the mappings so they are in terms of csv column
                // indices
                map = _.invert(map);
                // Remove empty values
                map = _.omit(map, '');
                // Then we set null values for unmapped columns
                var keys = _.keys(map);
                _.each($scope.csv.columns, function (column, index) {
                    map[index] = _.contains(keys, index.toString()) ? map[index] : null;
                });

                return map;
            }

            function checkForDuplicates() {
                // Check to make sure the user hasn't double mapped a key
                // First, collect the counts for all keys
                // Remove empty fields
                var map = _.omit($scope.maps_to, function (value, key, object) {
                    return value === '';
                });
                return _.chain(map)
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
            }
        }
    };
}];
