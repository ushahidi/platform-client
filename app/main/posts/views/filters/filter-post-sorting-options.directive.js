module.exports = FilterPostSortingOptionsDirective;

FilterPostSortingOptionsDirective.$inject = [
    'moment',
    '$rootScope',
    'PostActiveOrderOptions'
];
function FilterPostSortingOptionsDirective(
    moment,
    $rootScope,
    PostActiveOrderOptions
) {
    return {
        restrict: 'E',
        scope: {},
        template: require('./filter-post-sorting-options.html'),
        link: PostSortingOptionsLink,
        controller: FilterPostSortingOptionsController
    };

    function PostSortingOptionsLink($scope) {
        (function () {
            $scope.orderOptions = PostActiveOrderOptions.getDefinition().order.options;
            $scope.orderByOptions = PostActiveOrderOptions.getDefinition().orderBy.options;
            $scope.unlockedOnTopOptions = PostActiveOrderOptions.getDefinition().unlockedOnTop;
            $scope.orderGroup = PostActiveOrderOptions.get();
        })();

    }
}
FilterPostSortingOptionsController.$inject = [
    '$scope',
    'PostActiveOrderOptions'
];
function FilterPostSortingOptionsController($scope,PostActiveOrderOptions) {
    $scope.change = function () {
        console.log($scope.orderGroup);
        console.log(PostActiveOrderOptions.put($scope.orderGroup));
    };
}
