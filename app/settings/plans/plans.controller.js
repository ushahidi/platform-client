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
    $rootScope.setLayout('layout-c');
    $scope.switchTab = switchTab;
    $scope.activeTab = 'demo';
    $translate('nav.plan_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
        $scope.tier = site.tier;
    });
    $scope.username = encodeURIComponent(($rootScope.currentUser || {}).email);
    /* globals apiDomain, deploymentsDomain */
    $scope.cloudDomain = typeof deploymentsDomain !== 'undefined' ? deploymentsDomain : 'ushahidi.io' ;
    $scope.subdomain = typeof apiDomain !== 'undefined' ?
        CONST.BACKEND_URL.replace('.' + apiDomain, '').replace(/http[s]?:\/\//, '') :
        CONST.BACKEND_URL;

    function switchTab(tab) {
        // First unset last active tab
        if ($scope.activeTab) {
            angular.element(document.getElementById($scope.activeTab)).removeClass('active');
            angular.element(document.getElementById($scope.activeTab + '-li')).removeClass('active');
        }
        // Set new active tab
        angular.element(document.getElementById(tab)).addClass('active');
        angular.element(document.getElementById(tab + '-li')).addClass('active');
        $scope.activeTab = tab;
    }

}];
