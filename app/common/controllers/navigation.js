module.exports = NavigationController;

NavigationController.$inject = ['Authentication', 'ConfigEndpoint', 'BootstrapConfig', '$rootScope', 'Features'];
function NavigationController(Authentication, ConfigEndpoint, BootstrapConfig, $rootScope, Features) {
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
        });
    }

    // Move to add post button (or associated service)
    // function canCreatePost() {
    //     return $rootScope.loggedin || !vm.site.private;
    // };

    // Move to mode bar (or associated service)
    // function canRegister() {
    //     return !vm.site.private;
    // };

    // Move to mode bar (or associated service)
    // function logoutClick(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     Authentication.logout();
    // };
}
