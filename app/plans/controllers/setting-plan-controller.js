module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
    'CONST',
    'ConfigEndpoint',
function (
    $scope,
    $translate,
    $rootScope,
    CONST,
    ConfigEndpoint
) {

    $translate('nav.plan_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });
    $scope.legacyPlan = false;
    var standardTiers = ['free', 'surveyor', 'responder'];

    ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
        $scope.tier = site.tier;
        if (standardTiers.indexOf(site.tier) === -1) {
            $scope.specialPlan = site.tier;
        }
    });
    $scope.username = ($rootScope.currentUser || {}).email;
    /* globals apiDomain, deploymentsDomain */
    $scope.cloudDomain = typeof deploymentsDomain !== 'undefined' ? deploymentsDomain : 'ushahidi.io' ;
    $scope.subdomain = typeof apiDomain !== 'undefined' ?
        CONST.BACKEND_URL.replace('.' + apiDomain, '').replace(/http[s]?:\/\//, '') :
        CONST.BACKEND_URL;


}];
