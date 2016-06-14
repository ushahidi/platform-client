module.exports = [
    'Features',
    'Authentication',
    'Registration',
    'ModalService',
    '$rootScope',
    'ModalService',
function (
    Features,
    Authentication,
    Registration,
    ModalService,
    $rootScope
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            currentUser: '='
        },
        templateUrl: 'templates/frame/mode-bar.html',
        link: function ($scope, $element, $attrs) {
            $scope.baseUrl = 'views/';
            $scope.activeMode = 'map';
            $scope.moreActive = false;
            $scope.isActivityAvailable = false;

            $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;
            $scope.showMore = showMore;
            $scope.viewCollectionListing = viewCollectionListing;
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
            }

            // Show account settings
            function viewAccountSettings() {
                ModalService.openTemplate('<account-settings></account-settings>', '', false, false, true, true);
            }

            // Show support links
            function viewSupportLinks() {
                ModalService.openUrl('templates/common/support-links.html', '', false, false, true, true);
            }

            // Show collection listing
            function viewCollectionListing() {
                $rootScope.$emit('collectionListing:show');
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
