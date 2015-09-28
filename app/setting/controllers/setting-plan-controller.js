module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
    'CONST',
    'Config',
function (
    $scope,
    $translate,
    $rootScope,
    CONST,
    Config
) {

    $translate('nav.plan_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    $scope.tier = Config.site.tier;
    $scope.username = ($rootScope.currentUser || {}).email;
    /* globals apiDomain, deploymentsDomain */
    $scope.cloudDomain = typeof deploymentsDomain !== 'undefined' ? deploymentsDomain : 'ushahidi.io' ;
    $scope.subdomain = typeof apiDomain !== 'undefined' ?
        CONST.BACKEND_URL.replace('.' + apiDomain, '').replace(/http[s]?:\/\//, '') :
        CONST.BACKEND_URL;

}];
