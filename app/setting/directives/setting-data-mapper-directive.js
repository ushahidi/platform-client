module.exports = [
    '$translate',
    '$location',
    'FormEndpoint',
    'DataImportEndpoint',
    'DataRetriever',
    'Notify',
    '_',
function (
    $translate,
    $location,
    FormEndpoint,
    DataImportEndpoint,
    DataRetriever,
    Notify,
    _
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.cancelImport = function () {
                $translate('notify.data_import.csv_import_cancel')
                .then(function (message) {
                    Notify.showNotificationSlider(message);

                    $scope.deleteDataImport($scope.csv);
                    $location.url('/settings/data-import/');
                });
            };

            $scope.deleteDataImport = function () {
                DataImportEndpoint.delete($scope.csv);
            };

            $scope.triggerImport = function () {
                DataImportEndpoint.import({id: $scope.csv.id, action: 'import'})
                .$promise
                .then(function (response) {
                    $translate('notify.data_import.csv_mappings_set', {
                        processed: response.processed,
                        errors: response.errors
                    }).then(
                        function (message) {
                            Notify.showNotificationSlider(message);

                            $scope.deleteDataImport($scope.csv);
                            $location.url('/views/list');
                        });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            // Check for missing required fields and return the missing fields
            $scope.checkRequiredFields = function (fields) {
                var missing = [];
                var difference = _.difference($scope.required_fields, fields);

                if (!_.isEmpty(difference)) {
                    _.each(difference, function (field) {
                        missing.push(
                            $scope.required_fields_map[field]
                        );
                    });
                }

                return missing;
            };

            $scope.progressToConfigure = function (csv) {

                if (_.every(csv.maps_to, _.isEmpty)) {
                    $translate('notify.data_import.no_mappings').then(function (message) {
                        Notify.showAlerts([message]);
                    });
                    return;
                }

                // Check to make sure the user hasn't double mapped a key
                // First, collect the counts for all keys
                var dups = _.countBy(csv.maps_to, function (item) {
                    return item;
                });

                // Second, check if any of the keys appear more than once
                var duplicateVars = _.filter(csv.maps_to, function (item) {
                    if (dups[item] > 1) {
                        return item;
                    }
                });

                duplicateVars = _.uniq(duplicateVars);

                // third, warn the user which keys have been duplicated
                if (duplicateVars.length > 0) {

                    $translate('notify.data_import.duplicate_fields', {duplicates: duplicateVars.join(', ')}).then(
                    function (message) {
                        Notify.showAlerts([message]);
                    });
                    return;
                }

                //Check required fields are set
                var missing = $scope.checkRequiredFields(csv.maps_to);
                if (!_.isEmpty(missing)) {
                    $translate('notify.data_import.required_fields', {required: missing.join(', ')})
                    .then(function (message) {
                        Notify.showAlerts([message]);
                    });
                    return;
                }

                csv.fixed = {
                    'form': $scope.form.id
                };

                // Pass data to configure stage via DataRetriever service
                DataRetriever.setImportData(csv);
                $location.url('/settings/data-configure/');

            };
        }
    };
}];
