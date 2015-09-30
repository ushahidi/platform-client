module.exports = [
    '$scope',
    'Authentication',
    'ConfigEndpoint',
    'Config',
    '$rootScope',
function (
    $scope,
    Authentication,
    ConfigEndpoint,
    Config,
    $rootScope
) {
    $scope.isHome = true;
    $scope.activityIsAvailable = (typeof Config.features.views !== 'undefined') ? Config.features.views.activity : true;

    // Start with preloaded config
    $scope.site = Config.site;
    // Then update from server
    var reloadSiteConfig = function () {
        // @todo use config service
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            $scope.site = site;
        });
    };

    $rootScope.$on('event:update:header', function () {
        reloadSiteConfig();
    });

    $rootScope.$on('$routeChangeSuccess', function (ev, current) {
        if (current.$$route &&
                (current.$$route.originalPath === '/views/:view?' || current.$$route.originalPath === '/')
            ) {
            $scope.isHome = true;
        } else {
            $scope.isHome = false;
        }
    });

    reloadSiteConfig();

    // @todo: Integrate the modal state controller into a globally accessible
    // directive which binds the same logic but does not effect markup.
    // This is related to the same functionality in the set controller
    // collections-controller.js
    $scope.collectionOpen = {};
    $scope.collectionOpen.data = false;
    $scope.collectionIsOpen = function () {
        $scope.collectionOpen.data = !$scope.collectionOpen.data;
    };


    $scope.logoutClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        Authentication.logout();
    };

}];
