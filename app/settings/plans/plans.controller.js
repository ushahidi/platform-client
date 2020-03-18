module.exports = [
    '$scope',
    '$translate',
    '$rootScope',
    'CONST',
    'ConfigEndpoint',
    'Notify',
function (
    $scope,
    $translate,
    $rootScope,
    CONST,
    ConfigEndpoint,
    Notify
) {
    const tierMap = {
        'free': {
            plan: 'Mapper',
            newPlan: 'Ushahidi Demo'
        },
        'surveyor': {
            plan: 'Surveyor',
            newPlan: 'Ushahidi Basic'
        },
        'responder': {
            plan: 'Responder',
            newPlan: 'Ushahidi Basic'
        },
        'free-pre-jun-2016': {
            plan: 'Mapper (Legacy)',
            newPlan: 'Ushahidi Demo'
        },
        'zerorated': {
            plan: 'Social Impact',
            newPlan: 'Ushahidi Basic'
        }
    };
    $rootScope.setLayout('layout-c');
    window.scrollTo(0, 0);
    $scope.switchTab = switchTab;
    $scope.activeTab = 'demo';
    $translate('nav.plan_settings').then(function (title) {
        $scope.title = title;
        $rootScope.$emit('setPageTitle', title);
    });

    ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
        $scope.tier = site.tier;
        const msgAll =
            'You have the <strong>' + tierMap[$scope.tier].plan + '</strong> plan. ' +
            'This plan is now out of date and has been replaced by <strong>' + tierMap[$scope.tier].newPlan +
            '</strong>. ';

        if ($rootScope.isAdmin() && ($scope.tier === 'zerorated' || $scope.tier === 'surveyor' ||  $scope.tier === 'responder')) {
            const msgPaid = 'Your deployment will be upgraded, at no additional cost, to the new Ushahidi Basic plan. ' +
                'This change will occur between 8 October 2018 and 12 October 2018.';
            Notify.notifyPermanent(msgAll + msgPaid);
        } else if ($rootScope.isAdmin() && ($scope.tier === 'free' || $scope.tier === 'free-pre-jun-2016')) {
            const msgFree = 'Your account will be migrated to Ushahidi Demo between 8 October 2018 and 12 October 2018. ';
            Notify.notifyPermanent(msgAll + msgFree);
        }
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
