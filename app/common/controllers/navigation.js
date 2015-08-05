module.exports = [
    '$scope',
    'Authentication',
    'ConfigEndpoint',
    'BootstrapConfig',
function (
    $scope,
    Authentication,
    ConfigEndpoint,
    BootstrapConfig
) {

    // Start with preloaded config
    $scope.site = BootstrapConfig;
    // Then update from server
    ConfigEndpoint.get({ id: 'site' }).$promise.then(function (site) {
        $scope.site = site;
    });

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
