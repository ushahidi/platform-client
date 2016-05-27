module.exports = [
    '$scope',
    '$translate',
function (
    $scope,
    $translate
) {

    $translate('tool.manage_views').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

}];
