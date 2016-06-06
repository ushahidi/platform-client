module.exports = [
    'ViewHelper',
    'Authentication',
    'ModalService',
    '$rootScope',
    'ModalService',
function (
    ViewHelper,
    Authentication,
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

            $scope.login = openLoginModal;
            $scope.logout = Authentication.logout;
            $scope.register = openRegisterModal;

            // Show login modal
            function openLoginModal() {
                ModalService.openTemplate('<login></login>', 'nav.login', false, false, true, false);
            }

            function openRegisterModal() {
                ModalService.openTemplate('<register></register>', 'nav.register', false, false, true, false);
            }

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
