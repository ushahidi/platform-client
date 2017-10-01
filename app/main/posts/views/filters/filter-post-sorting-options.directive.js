module.exports = FilterPostSortingOptionsDirective;

FilterPostSortingOptionsDirective.$inject = [
    'moment',
    '$rootScope',
    '_',
    'PostActiveOrderOptions'
];
function FilterPostSortingOptionsDirective(moment, $rootScope, _, PostActiveOrderOptions) {
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
            var activeOrderOptions = PostActiveOrderOptions.getDefinition();
            console.log(ngModel);
            $scope.orderOptions = activeOrderOptions.order.options;
            $scope.orderByOptions = activeOrderOptions.orderBy.options;
            $scope.unlockedOnTopOptions = activeOrderOptions.unlockedOnTop;
            $scope.orderGroup = PostActiveOrderOptions.get();
            $scope.change = function () {
                console.log('change1');
                console.log(PostActiveOrderOptions.put($scope.orderGroup));
            };
        }
        activate();
        $scope.$watch('orderGroup', saveToView, true);
        function saveToView(orderGroup) {
            ngModel.$setViewValue(angular.copy(orderGroup));
        }
    }
}
