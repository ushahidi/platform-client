module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
function (
    $scope,
    $translate,
    $rootScope
) {

    $translate('tool.site_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

}];
