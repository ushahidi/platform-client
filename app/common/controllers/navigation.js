module.exports = [
    '$scope',
    'Authentication',
    'ConfigEndpoint',
    'BootstrapConfig',
    '$rootScope',
function (
    $scope,
    Authentication,
    ConfigEndpoint,
    BootstrapConfig,
    $rootScope
) {

    // Start with preloaded config
    $scope.site = BootstrapConfig;
    // Then update from server
    var reloadSiteConfig = function () {
        ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
            $scope.site = site;
        });
    };

    $rootScope.$on('event:update:header', function () {
        reloadSiteConfig();
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
