module.exports = [
    '$translate',
    '$location',
    'FormEndpoint',
    'DataImportEndpoint',
//    'DataRetriever',
    'Notify',
    '_',
    '$q',
function (
    $translate,
    $location,
    FormEndpoint,
    DataImportEndpoint,
//    DataRetriever,
    Notify,
    _,
    $q
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.cancelImport = function () {
                Notify.notify('notify.data_import.csv_import_cancel');

                $scope.deleteDataImport($scope.csv);
                $location.url('/settings/data-import/');
            };

            $scope.deleteDataImport = function () {
                DataImportEndpoint.delete($scope.csv);
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
                    Notify.error('notify.data_import.no_mappings');
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
                    Notify.error('notify.data_import.duplicate_fields', {duplicates: duplicateVars.join(', ')});
                    return;
                }

                //Check required fields are set
                var missing = $scope.checkRequiredFields(csv.maps_to);
                if (!_.isEmpty(missing)) {
                    Notify.error('notify.data_import.required_fields', {required: missing.join(', ')});
                    return;
                }

                csv.fixed = {
                    'form': $scope.form.id
                };

                // Update and import as this is the final step for now.
                updateAndImport(csv);

                // @todo Configure additional fields
                // Pass data to configure stage via DataRetriever service
                //DataRetriever.setImportData(csv);
                //$location.url('/settings/data-configure/');
            };

            function updateAndImport(csv) {
                DataImportEndpoint.update(csv).$promise
                    .then(function () {
                        DataImportEndpoint.import({id: csv.id, action: 'import'}).$promise
                            .then(function (response) {
                                var processed = response.processed,
                                    errors = response.errors;

                                Notify.success('notify.data_import.csv_mappings_set', {processed: processed, errors: errors});

                                // Go to posts list
                                $location.url('/views/list/');
                            }, function (errorResponse) {
                                Notify.apiErrors(errorResponse);
                            });
                    }, function (errorResponse) {
                        Notify.apiErrors(errorResponse);
                    });
            }
        }
    };
}];
