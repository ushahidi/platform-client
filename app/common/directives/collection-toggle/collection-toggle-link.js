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
                // Collection toggle expects an array of posts
                $rootScope.$emit('event:collection:show:toggle', [$scope.post]);
            };
        },
        templateUrl: 'templates/common/collection-toggle/collection-toggle-link.html'
    };
}];
