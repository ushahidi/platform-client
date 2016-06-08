module.exports = [
    'ViewHelper',
    'Authentication',
    'Registration',
    'ModalService',
    '$rootScope',
    'ModalService',
function (
    ViewHelper,
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
            $scope.isActivityAvailable = ViewHelper.isViewAvailable('activity');
            $scope.hasManageSettingsPermission = $rootScope.hasManageSettingsPermission;

            // Show account settings
            $scope.viewAccountSettings = function () {
                ModalService.openTemplate('<account-settings></account-settings>', '', false, false, true, true);
            };

            $scope.login = Authentication.openLogin;
            $scope.logout = Authentication.logout;
            $scope.register = Registration.openRegister;

            // Show collection listing
            $scope.viewCollectionListing = function () {
                $rootScope.$emit('collectionListing:show');
            };

            $rootScope.$on('event:mode:change', function (ev, mode) {
                $scope.activeMode = mode;
            });

            $rootScope.$on('event:collection:show', function (ev, collection) {
                $scope.baseUrl = 'collections/' + collection.id + '/';
            });

            $rootScope.$on('event:collection:close', function (ev, savedsearch) {
                $scope.baseUrl = 'views/';
            });

            $rootScope.$on('event:savedsearch:show', function (ev, savedsearch) {
                $scope.baseUrl = 'savedsearches/' + savedsearch.id + '/';
            });

            $rootScope.$on('event:savedsearch:close', function (ev, savedsearch) {
                $scope.baseUrl = 'views/';
            });
        }
    };
}];
