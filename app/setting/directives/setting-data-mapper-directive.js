module.exports = [
    '$translate',
    '$location',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
    '_',
function (
    $translate,
    $location,
    FormEndpoint,
    DataImportEndpoint,
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
                    $location.url('/settings/data-import/');
                });
            };

            $scope.submitMappings = function (csv) {

                // Check to make sure the user hasn't double mapped a key
                // First, collect the coutns for all keys
                var dups = _.countBy(csv.maps_to, function (item) {
                    return item;
                });

                // Second, check if any of the keys appears more than once
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

                csv.completed = true;
                csv.unmapped = [];
                DataImportEndpoint.update(csv)
                .$promise
                .then(function (csv) {
                    $translate('notify.data_import.csv_mappings_set').then(
                    function (message) {
                        Notify.showNotificationSlider(message);
                        $location.url('/views/list');
                    });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
        }
    };
}];
