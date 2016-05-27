module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
function (
    $scope,
    $rootScope,
    $translate
) {
    $translate('tool.settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });
}];
