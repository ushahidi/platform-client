module.exports = [
    '$translate',
    '$rootScope',
    '$q',
    'ConfigEndpoint',
    'Notify',
    'Features',
    '_',
    function (
        $translate,
        $rootScope,
        $q,
        ConfigEndpoint,
        Notify,
        Features,
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

                    Features.loadFeatures().then(function () {
                        $scope.donationEnabled = Features.isFeatureEnabled('donation');
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

                function isActiveStep(step) {
                    return $scope.activeStep === step;
                }

                function completeStepOne() {
                    if (!$scope.fileContainer.file) {
                        Notify.error('notify.donation.file_missing');
                        return;
                    }

                    if (!$scope.selectedForm) {
                        Notify.error('notify.donation.form_missing');
                        return;
                    }

                    var formData = new FormData();
                    formData.append('file', $scope.fileContainer.file);
                    formData.append('form_id', $scope.selectedForm.id);

                    // ConfigEndpoint.upload(formData)
                    //     .then(function (csv) {
                    //         Notify.notify('notify.data_import.csv_upload', {name: $scope.fileContainer.file.name});
                    //         $scope.stepOneComplete = true;
                    //         $scope.activeStep = 2;
                    //         $scope.csv = csv;

                    //         loadStepTwo();
                    //     }, function (errorResponse) {
                    //         Notify.apiErrors(errorResponse);
                    //     });
                }

                function loadStepTwo(results) {

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
