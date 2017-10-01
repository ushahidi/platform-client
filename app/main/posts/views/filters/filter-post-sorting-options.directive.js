module.exports = FilterPostSortingOptionsDirective;

FilterPostSortingOptionsDirective.$inject = [
    'moment',
    '$rootScope',
    'PostActiveOrderOptions'
];
function FilterPostSortingOptionsDirective(moment, $rootScope, PostActiveOrderOptions) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
        },
        template: require('./filter-post-sorting-options.html'),
        link: PostSortingOptionsLink
    };
    function PostSortingOptionsLink($scope, $element, $attrs, ngModel) {
        function activate() {
            console.log(ngModel);
            $scope.orderOptions = PostActiveOrderOptions.getDefinition().order.options;
            $scope.orderByOptions = PostActiveOrderOptions.getDefinition().orderBy.options;
            $scope.unlockedOnTopOptions = PostActiveOrderOptions.getDefinition().unlockedOnTop;
            $scope.orderGroup = PostActiveOrderOptions.get();
            $scope.change = function () {
                console.log($scope.orderGroup);
                console.log(PostActiveOrderOptions.put($scope.orderGroup));
            };
        }
        activate();
        $scope.$watch('orderGroup', saveToView, true);
        function saveToView(orderGroup) {
            console.log('savetovieworderGroup', orderGroup);
            ngModel.$setViewValue(orderGroup);
        }
    }
}
