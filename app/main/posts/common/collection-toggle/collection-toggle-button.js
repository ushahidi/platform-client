module.exports = [
    '$rootScope',
    '_',
    'CollectionsService',
function (
    $rootScope,
    _,
    CollectionsService
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

                CollectionsService.showAddToCollection(selectedPostObjects);
            };
        },
        template: require('./collection-toggle-button.html')
    };
}];
