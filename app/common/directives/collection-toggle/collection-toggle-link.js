module.exports = [
    '$rootScope',
function (
    $rootScope
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
                $rootScope.$emit('collectionToggle:show', [$scope.post]);
            };
        },
        template: require('./collection-toggle-link.html')
    };
}];
