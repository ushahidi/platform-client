module.exports = [
    '$q',
    '$location',
    '$translate',
    'FormEndpoint',
    'DataImportEndpoint',
    '_',
    'Notify',
function (
    $q,
    $location,
    $translate,
    FormEndpoint,
    DataImportEndpoint,
    _,
    Notify
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.formId;
            $scope.file;
            $scope.importCSV = function () {
                DataImportEndpoint.save({
                    'form_id': $scope.formId,
                    'file': $scope.file
                }).$promise.then(function () {
                    $translate('notify.data-import.csv_upload', {$scope.file.name}).then(
                    function (message)
                        Notify.showNotificationSlider(message);
                    });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
        });
});
