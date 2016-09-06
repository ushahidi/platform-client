module.exports = [
    '$translate',
    '$location',
    'FormEndpoint',
    'DataImportEndpoint',
    'Notify',
    'Features',
function (
    $translate,
    $location,
    FormEndpoint,
    DataImportEndpoint,
    Notify,
    Features
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.formId;
            Features.loadFeatures().then(function () {
                $scope.csvEnabled = Features.isFeatureEnabled('data-import');
            });
            $scope.importCSV = function () {
                if (!$scope.fileContainer.file) {
                    Notify.error('notify.data_import.file_missing');
                    return;
                }
                var formData = new FormData();
                formData.append('file', $scope.fileContainer.file);
                formData.append('form_id', $scope.formId);

                DataImportEndpoint.upload(formData)
                .then(function (csv) {
                    Notify.notify('notify.data_import.csv_upload', {name: $scope.fileContainer.file.name});
                    $location.url('/settings/data-mapper/' + $scope.formId + '/' + csv.id);
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };
        }
    };
}];
