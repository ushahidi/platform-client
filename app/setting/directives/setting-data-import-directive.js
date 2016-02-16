module.exports = [
    '$translate',
    '$location',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
    'Config',
function (
    $translate,
    $location,
    FormEndpoint,
    DataImportEndpoint,
    Notify,
    Config
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.formId;

            $scope.csvEnabled = Config.features['data-import'].csv.enabled ? true : false;

            $scope.importCSV = function () {
                if (!$scope.fileContainer.file) {
                    $translate('notify.data_import.file_missing').then(function (message) {
                        Notify.showApiErrors(message);
                    });
                    return;
                }
                var formData = new FormData();
                formData.append('file', $scope.fileContainer.file);
                formData.append('form_id', $scope.formId);

                DataImportEndpoint.upload(formData)
                .then(function (csv) {
                    $translate('notify.data_import.csv_upload', {name: $scope.fileContainer.file.name}).then(
                    function (message) {
                        Notify.showNotificationSlider(message);
                        $location.url('/settings/data-mapper/' + $scope.formId + '/' + csv.id);
                    });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
        }
    };
}];
