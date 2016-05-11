module.exports = [
    'ModeViewHelper',
function (
    ModeViewHelper
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'templates/frame/mode-bar.html',
        link: function ($scope, $element, $attrs) {
            $scope.views = ModeViewHelper.views();

            // TODO: move this out of function
            $scope.activeView = 'map';
            $scope.setActiveView = function (view_name) {
                $scope.activeView = view_name;
            };
        }
    };
}];
