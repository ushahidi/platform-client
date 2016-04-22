module.exports = [
    '$translate',
    '$location',
    'DataImportEndpoint',
    'FormAttributeEndpoint',
    'Notify',
    '_',
function (
    $translate,
    $location,
    DataImportEndpoint,
    FormAttributeEndpoint,
    Notify,
    _
) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $scope.post = {
                values: {}
            };

            $scope.configureAttributes = function (formId) {
                FormAttributeEndpoint.query({formId: formId}).$promise.then(function (attrs) {
                    var reducedAttributes = [];
                    // Remove already mapped fields
                    _.each(attrs, function (attr) {
                        if (!_.contains($scope.csv.maps_to, attr.key)) {
                            reducedAttributes.push(attr);
                        }
                    });

                    // Initialize values on post (helps avoid madness in the template)
                    reducedAttributes.map(function (attr) {
                        if (!$scope.post.values[attr.key]) {
                            if (attr.input === 'location') {
                                $scope.post.values[attr.key] = [null];
                            } else if (attr.input === 'checkbox') {
                                $scope.post.values[attr.key] = [];
                            } else {
                                $scope.post.values[attr.key] = [attr.default];
                            }
                        }
                    });
                    $scope.attributes = reducedAttributes;
                });
            };

            $scope.configureAttributes($scope.csv.fixed.form);

            $scope.cancelImport = function () {
                $translate('notify.data_import.csv_import_cancel')
                .then(function (message) {
                    Notify.showNotificationSlider(message);

                    $scope.deleteDataImport($scope.csv);
                    $location.url('/settings/data-import/');
                });
            };

            $scope.deleteDataImport = function () {
                DataImportEndpoint.delete($scope.csv);
            };

            $scope.triggerImport = function () {
                DataImportEndpoint.import({id: $scope.csv.id, action: 'import'})
                .$promise
                .then(function (response) {
                    $translate('notify.data_import.csv_mappings_set', {
                        processed: response.processed,
                        errors: response.errors
                    }).then(
                        function (message) {
                            Notify.showNotificationSlider(message);

                            $scope.deleteDataImport($scope.csv);
                            $location.url('/views/list');
                        });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.cleanPostValues = function (values) {
                // Clean up post values object
                _.each(values, function (value, key) {
                    // Strip out empty values
                    values[key] = _.filter(value);
                    // Remove entirely if no values are left
                    if (!values[key].length) {
                        delete values[key];
                    }
                });
                return values;
            };

            $scope.submitMappings = function () {

                var post = angular.copy($scope.post);
                $scope.csv.fixed.values = $scope.cleanPostValues(post.values);

                DataImportEndpoint.update($scope.csv)
                .$promise
                .then(function (csv) {
                    $scope.triggerImport(csv);
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };
        }
    };
}];
