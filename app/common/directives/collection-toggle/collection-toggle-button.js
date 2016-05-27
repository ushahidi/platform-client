module.exports = [
    '$rootScope',
    '$translate',
    '_',
function (
    $rootScope,
    $translate,
    _ 
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            posts: '=',
            selectedPosts: '=',
        },
        link: function ($scope, $element, $attrs, ngModel) {
            $scope.toggleCollection = function () {

                var postsSet = _.filter($scope.posts, function (post) {
                    return _.contains($scope.selectedPosts, post.id);
                });

                $rootScope.$emit('event:collection:show:toggle', postsSet);
            };
        },
        templateUrl: 'templates/common/collection-toggle/collection-toggle-button.html'
    };
}];
