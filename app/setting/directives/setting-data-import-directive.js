module.exports = [
    '$translate',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
function (
    $translate,
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

                    DataImportEndpoint(formData)
                    .then(function () {
                        $translate('notify.data_import.csv_upload', {name: $scope.file.name}).then(
                        function (message) {
                            Notify.showNotificationSlider(message);
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
