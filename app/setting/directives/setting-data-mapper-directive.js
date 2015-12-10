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
                csv.maps_to = _.map(csv.maps_to, function (item) {
                    return item ? item.label : null;
                });
                DataImportEndpoint.update(csv)
                .$promise
                .then(function (csv) {
                    $translate('notify.data_import.csv_mappings_set').then(
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
