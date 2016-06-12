module.exports = [
    '$scope',
    '$rootScope',
    '$location',
    'initialData',
    '_',
function (
    $scope,
    $rootScope,
    $location,
    initialData,
    _
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    $scope.required_fields = [];
    $scope.required_fields_map = {};
    $scope.form = initialData.form;
    // Change required attribute labels to show required
    _.each($scope.form.attributes, function (attribute, index) {
        if (attribute.required) {
            $scope.required_fields.push(attribute.key);
            $scope.required_fields_map[attribute.key] = attribute.label;
            // @todo Can't use <span></span> here without a filter or falling
            // back to ng-repat with ng-bind-html
            //$scope.form.attributes[index].label = attribute.label + '<span class="required"></span>';
            $scope.form.attributes[index].label = attribute.label + ' [*]';
        }
    });
    $scope.csv = initialData.csv;
}];
