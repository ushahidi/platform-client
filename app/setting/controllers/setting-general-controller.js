module.exports = [
    '$scope',
    '$translate',
function (
    $scope,
    $translate
) {

    $translate('tool.site_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

}];
