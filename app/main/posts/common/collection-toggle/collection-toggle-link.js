module.exports = [
    '$rootScope',
    'CollectionsService',
function (
    $rootScope,
    CollectionsService
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
                CollectionsService.showAddToCollection([$scope.post]);
            };
        },
        template: require('./collection-toggle-link.html')
    };
}];
