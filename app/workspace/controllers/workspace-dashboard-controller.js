module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
function (
    $scope,
    $rootScope,
    $translate
) {
    $translate('workspace.recent_activity').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });
}];
