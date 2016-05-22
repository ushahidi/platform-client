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
            $scope.views = ViewHelper.views();

            // TODO: move this out of function
            $scope.activeView = 'map';
            $scope.setActiveView = function (view_name) {
                $scope.activeView = view_name;
            };

            $scope.currentUser = $rootScope.currentUser;

            // Show collection listing  
            $scope.viewCollectionListing = function () {
                $rootScope.$emit('event:collection:show:listing');
            };
        }
    };
}];
