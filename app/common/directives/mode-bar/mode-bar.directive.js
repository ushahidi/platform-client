module.exports = [
    'Features',
    'Authentication',
    'Registration',
    'ModalService',
    '$rootScope',
    'ConfigEndpoint',
    'CollectionsService',
    '$window',
function (
    Features,
    Authentication,
    Registration,
    ModalService,
    $rootScope,
    ConfigEndpoint,
    CollectionsService,
    $window
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            currentUser: '='
        },
        template: require('./mode-bar.html'),
        link: function ($scope, $element, $attrs) {
            $scope.moreActive = false;
            $scope.isActivityAvailable = false;
            $scope.canRegister = false;

            $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
            $scope.showMore = showMore;
            $scope.viewCollectionListing = CollectionsService.showCollectionList;
            $scope.viewAccountSettings = viewAccountSettings;
            $scope.viewSupportLinks = viewSupportLinks;
            $scope.login = Authentication.openLogin;
            $scope.logout = Authentication.logout;
            $scope.register = Registration.openRegister;
            $scope.intercomAppId = $window.ushahidi.intercomAppId;

            activate();

            function activate() {
                $scope.$on('$locationChangeStart', handleRouteChange);

                Features.loadFeatures().then(function () {
                    $scope.isActivityAvailable = Features.isViewEnabled('activity');
                });

                ConfigEndpoint.get({id: 'site'}, function (site) {
                    $scope.canRegister = !site.private;
                });
            }

            // Show account settings
            function viewAccountSettings() {
                ModalService.openTemplate('<account-settings></account-settings>', '', false, false, true, true);
            }

            // Show support links
            function viewSupportLinks() {
                var scope = {
                    intercomAppId: $scope.intercomAppId
                };
                ModalService.openTemplate(require('./support-links.html'), '', false, scope, true, true);
            }

            // Add 'click' handler to toggle trigger
            function showMore() {
                $scope.moreActive = !$scope.moreActive;
            }

            function handleRouteChange() {
                $scope.moreActive = false;
            }
        }
    };
}];
