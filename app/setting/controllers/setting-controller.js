module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
function (
    $scope,
    $rootScope,
    $translate
) {

    // Change layout class
    $rootScope.setLayout('layout-c');

    $translate('tool.settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });
}];
