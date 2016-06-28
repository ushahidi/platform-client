module.exports = [
    '$translate',
    '$location',
    '$filter',
    'DataImportEndpoint',
    'PostEditService',
    'Notify',
    '_',
function (
    $translate,
    $location,
    $filter,
    DataImportEndpoint,
    PostEditService,
    Notify,
    _
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            // Create template post
            $scope.post = {
                form: {
                    id: $scope.csv.fixed.form
                },
                values: {},
                tags: {},
                completed_stages: {},
                // Enable status setting for bulk import posts
                allowed_privileges: [
                    'change_status'
                ]
            };

            // Set post-editor mode to 'bulk_data_import'
            $scope.postMode = 'bulk_data_import';

            $scope.cancelImport = function () {
                Notify.notify('notify.data_import.csv_import_cancel');

                $scope.deleteDataImport($scope.csv);
                $location.url('/settings/data-import/');
            };

            $scope.deleteDataImport = function () {
                DataImportEndpoint.delete($scope.csv);
            };

            $scope.triggerImport = function () {
                DataImportEndpoint.import({id: $scope.csv.id, action: 'import'})
                .$promise
                .then(function (response) {
                    Notify.notify('notify.data_import.csv_mappings_set', {
                        processed: response.processed,
                        errors: response.errors
                    });

                    $scope.deleteDataImport($scope.csv);
                    $location.url('/views/list');
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };

            $scope.submitMappings = function () {
                var post = PostEditService.cleanPostValues(angular.copy($scope.post));
                // Set post fixed values
                $scope.csv.fixed.values = post.values;
                (post.tags.length) ? $scope.csv.fixed.tags = post.tags : '';
                (post.title) ? $scope.csv.fixed.title = post.title : '';
                (post.content) ? $scope.csv.fixed.content = post.content : '';

                DataImportEndpoint.update($scope.csv)
                .$promise
                .then(function (csv) {
                    $scope.triggerImport(csv);
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                });
            };
        }
    };
}];
