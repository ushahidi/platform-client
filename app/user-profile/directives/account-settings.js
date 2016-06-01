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
            var title,
                childScope,
                template = '<account-settings ng-show="visible"></account-settings>',

                unbind = $rootScope.$on('event:show:account_settings', function () {
                    childScope = $rootScope.$new();
                    childScope.visible = true;

                    UserEndpoint.getFresh({id: 'me'}).$promise
                        .then(function (user) {
                            title = user.realname || user.email;
                            ModalService.openTemplate(template, title, false, childScope, true, true);
                        });
                });

            scope.$on('$destroy', unbind);

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
