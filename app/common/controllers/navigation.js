module.exports = NavigationController;

NavigationController.$inject = ['Authentication', 'ConfigEndpoint', 'BootstrapConfig', '$rootScope', 'Features', 'Registration', 'Session'];
function NavigationController(Authentication, ConfigEndpoint, BootstrapConfig, $rootScope, Features, Registration, Session) {
    var vm = this;

    vm.site = BootstrapConfig;
    vm.reloadSiteConfig = reloadSiteConfig;
    //vm.canCreatePost = canCreatePost;
    //vm.canRegister = canRegister;
    //vm.logoutClick = logoutClick;

    activate();

    $rootScope.$on('event:update:header', reloadSiteConfig);

    function activate() {

        Features.loadFeatures().then(function () {
            vm.activityIsAvailable = Features.isViewEnabled('activity');
            vm.planIsAvailable = Features.isViewEnabled('plan');
        });

        reloadSiteConfig();
    }

    function reloadSiteConfig() {
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            vm.site = site;
            setInitialView();
        });
    }

    function setInitialView() {
        if (vm.site['always-show-signup'] && !Session.getSessionDataEntry('signupShown') && !Session.getSessionDataEntry('userId')) {
            Registration.openRegister();
            Session.setSessionDataEntry('signupShown', true);
        }
    }

    // Move to add post button (or associated service)
    // function canCreatePost() {
    //     return $rootScope.loggedin || !vm.site.private;
    // };
}
