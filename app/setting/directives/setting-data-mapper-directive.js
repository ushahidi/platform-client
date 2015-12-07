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
                    $location.url('/settings/data-mapper/' + $scope.formId + '/' + csv.id);
                });
            };

            $scope.submitMappings = function () {
                _.defaults($scope.csv, {form_attribute_id: null});
                DataImportEndpoint.save(csv)
                .then(function (csv) {
                    $translate('notify.data_import.csv_mappings_set', {name: $scope.file.name}).then(
                    function (message) {
                        Notify.showNotificationSlider(message);
                        //$location.url('/settings/data-mapper/' + $scope.formId + '/' + csv.id);
                    });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
        }
    }
}];
