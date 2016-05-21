module.exports = [
    '$rootScope',
    'UserEndpoint',
    '$timeout',
function (
    $rootScope,
    UserEndpoint,
    $timeout
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/users/account_settings.html',
        link: function ($scope) {
            $rootScope.$on('event:show:account_settings', function () {
                $scope.visible = true;
            });

            $scope.general = true;
            $scope.notifications = false;

            $scope.showGeneral = function () {
                $scope.general = true;
                $scope.notifications = false;
            };

            $scope.showNotifications = function () {
                $scope.general = false;
                $scope.notifications = true;
            };

            $scope.user = UserEndpoint.getFresh({id: 'me'});

            $scope.$on('event:close', function () {
                $scope.visible = false;
            });
        }
    };
}];
