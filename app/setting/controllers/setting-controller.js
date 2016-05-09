module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
function (
    $scope,
    $translate,
    $rootScope
) {
    $translate('tool.settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });
}];
