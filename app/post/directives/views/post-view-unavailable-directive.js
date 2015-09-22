module.exports = [
function (
) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            view: '='
        },
        templateUrl: 'templates/views/unavailable.html',
        link: function ($scope, $element, $attrs) {
            $scope.view = $attrs.view;
        }
    };
}];
