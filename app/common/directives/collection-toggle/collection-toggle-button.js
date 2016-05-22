module.exports = [
    '$rootScope',
    '$translate',
function (
    $rootScope,
    $translate
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            post: '='
        },
        link: function ($scope, $element, $attrs, ngModel) {
            $scope.toggleCollection = function () {
                $rootScope.$emit('event:collection:show:toggle', $scope.post);
            };
        },
        templateUrl: 'templates/common/collection-toggle/collection-toggle-button.html'
    };
}];
