module.exports = [
    '$rootScope',
    'UserEndpoint',
    'ModalService',
function (
    $rootScope,
    UserEndpoint,
    ModalService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/users/account_settings.html',
        link: function (scope) {
            scope.user = UserEndpoint.getFresh({id: 'me'});

            scope.general = true;
            scope.notifications = false;

            scope.showGeneral = function () {
                scope.general = true;
                scope.notifications = false;
            };

            scope.showNotifications = function () {
                scope.general = false;
                scope.notifications = true;
            };

            scope.$on('event:close', function () {
                ModalService.close();
            });
        }
    };
}];
