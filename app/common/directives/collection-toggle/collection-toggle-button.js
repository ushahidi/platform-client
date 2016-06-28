module.exports = [
    '$rootScope',
    '_',
function (
    $rootScope,
    _
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            posts: '=',
            selectedPosts: '='
        },
        link: function ($scope, $element, $attrs, ngModel) {
            $scope.toggleCollection = function () {
                // Reduce set of post of objects to only those currently selected
                var selectedPostObjects = _.filter($scope.posts, function (post) {
                    return _.contains($scope.selectedPosts, post.id);
                });

                $rootScope.$emit('collectionToggle:show', selectedPostObjects);
            };
        },
        templateUrl: 'templates/common/collection-toggle/collection-toggle-button.html'
    };
}];
