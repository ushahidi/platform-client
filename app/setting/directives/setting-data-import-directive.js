module.exports = [
    '$translate',
    '$location',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
function (
    $translate,
    $location,
    FormEndpoint,
    DataImportEndpoint,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.formId;

            $scope.importCSV = function () {
                if ($scope.fileContainer.file) {
                    var formData = new FormData();
                    formData.append('file', $scope.fileContainer.file);
                    formData.append('form_id', $scope.formId);

                    DataImportEndpoint.upload(formData)
                    .then(function (csv) {
                        $translate('notify.data_import.csv_upload', {name: $scope.file.name}).then(
                        function (message) {
                            Notify.showNotificationSlider(message);
                            $location.url('/settings/data-mapper/' + $scope.formId + '/' + csv.id);
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                    });
                } else {
                    $translate('notify.fata_import.file_missing').then(function (message) {
                      Notify.showApiErrors(message);
                    });
                }
            };
        }
    }
}];
