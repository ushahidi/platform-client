module.exports = [
    'Features',
    'Authentication',
    'Registration',
    'ModalService',
    '$rootScope',
    'ConfigEndpoint',
    'CollectionsService',
function (
    Features,
    Authentication,
    Registration,
    ModalService,
    $rootScope,
    ConfigEndpoint,
    CollectionsService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            currentUser: '='
        },
        template: require('./mode-bar.html'),
        link: function ($scope, $element, $attrs) {
            $scope.baseUrl = 'views/';
            $scope.activeMode = 'map';
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

            activate();

            function activate() {
                $scope.$on('$locationChangeStart', handleRouteChange);
                $rootScope.$on('event:mode:change', handleModeChange);
                $rootScope.$on('event:collection:show', handleCollectionShow);
                $rootScope.$on('event:collection:close', handleCollectionClose);
                $rootScope.$on('event:savedsearch:show', handleSavedSearchShow);
                $rootScope.$on('event:savedsearch:close', handleSavedSearchClose);

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
                ModalService.openTemplate(require('./support-links.html'), '', false, false, true, true);
            }

            // Add 'click' handler to toggle trigger
            function showMore() {
                $scope.moreActive = !$scope.moreActive;
            }

            function handleRouteChange() {
                $scope.moreActive = false;
            }

            function handleModeChange(ev, mode) {
                $scope.activeMode = mode;
            }

            function handleCollectionShow(ev, collection) {
                $scope.baseUrl = 'collections/' + collection.id + '/';
            }

            function handleCollectionClose(ev, savedsearch) {
                $scope.baseUrl = 'views/';
            }

            function handleSavedSearchShow(ev, savedsearch) {
                $scope.baseUrl = 'savedsearches/' + savedsearch.id + '/';
            }

            function handleSavedSearchClose(ev, savedsearch) {
                $scope.baseUrl = 'views/';
            }
        }
    };
}];
