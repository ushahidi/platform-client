module.exports = [
    '$scope',
    '$translate',
    'ConfigEndpoint',
function (
    $scope,
    $translate,
    ConfigEndpoint
) {
    $translate('tool.manage_appearance').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
}];
