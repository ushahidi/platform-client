module.exports = [
    'ViewHelper',
    'Authentication',
    '$rootScope',
function (
    ViewHelper,
    Authentication,
    $rootScope
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/frame/mode-bar.html',
        link: function ($scope, $element, $attrs) {
            $scope.views = ViewHelper.views();

            // TODO: move this out of function
            $scope.activeView = 'map';
            $scope.setActiveView = function (view_name) {
                $scope.activeView = view_name;
            };

            $scope.loggedin = $rootScope.loggedin;
            $scope.currentUser = $rootScope.currentUser;

            // Show login modal
            $scope.login = function () {
                $rootScope.$emit('event:login:show:loginModal');
            };

            // Log user out
            $scope.logout = function () {
                Authentication.logout();
            };

            // Show collection listing
            $scope.viewCollectionListing = function () {
                $rootScope.$emit('event:collection:show:listing');
            };
        }
    };
}];
