module.exports = [
    'ViewHelper',
    '$rootScope',
function (
    ViewHelper,
    $rootScope
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/frame/mode-bar.html',
        link: function ($scope, $element, $attrs) {
            $scope.baseUrl = '';
            $scope.activeMode = 'map';
            $scope.currentUser = $rootScope.currentUser;
            $scope.isActivityAvailable = ViewHelper.isViewAvailable('activity');

            // Show collection listing
            $scope.viewCollectionListing = function () {
                $rootScope.$emit('event:collection:show:listing');
            };

            $rootScope.$on('event:mode:change', function (ev, mode) {
                $scope.activeMode = mode;
            });
        }
    };
}];
