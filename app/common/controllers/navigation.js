module.exports = [
    '$scope',
    'Authentication',
    'ConfigEndpoint',
    '$rootScope',
    'Features',
function (
    $scope,
    Authentication,
    ConfigEndpoint,
    $rootScope,
    Features
) {
    $scope.isHome = true;
    $scope.activityIsAvailable = Features.isViewEnabled('activity');
    $scope.planIsAvailable = Features.isViewEnabled('plan');

    // Then update from server
    $scope.reloadSiteConfig = function () {
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            $scope.site = site;
        });
    };

    $rootScope.$on('event:update:header', function () {
        $scope.reloadSiteConfig();
    });

    $rootScope.$on('$routeChangeSuccess', function (ev, current) {
        if (current && current.$$route &&
                (current.$$route.originalPath === '/views/:view?' || current.$$route.originalPath === '/')
            ) {
            $scope.isHome = true;
        } else {
            $scope.isHome = false;
        }
    });

    $scope.reloadSiteConfig();

    // @todo: Integrate the modal state controller into a globally accessible
    // directive which binds the same logic but does not effect markup.
    // This is related to the same functionality in the set controller
    // collections-controller.js
    $scope.collectionOpen = {};
    $scope.collectionOpen.data = false;
    $scope.collectionIsOpen = function () {
        $scope.collectionOpen.data = !$scope.collectionOpen.data;
    };

    $scope.canCreatePost = function () {
        return $scope.loggedin || !$scope.site.private;
    };

    $scope.canRegister = function () {
        return !$scope.site.private;
    };

    $scope.logoutClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        Authentication.logout();
    };



}];
