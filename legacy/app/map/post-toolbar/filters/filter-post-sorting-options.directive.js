module.exports = FilterPostSortingOptionsDirective;

FilterPostSortingOptionsDirective.$inject = [
    '$rootScope',
    '_'
];
function FilterPostSortingOptionsDirective($rootScope, _) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {},
        template: require('./filter-post-sorting-options.html'),
        link: PostSortingOptionsLink
    };
    function PostSortingOptionsLink($scope, $element, $attrs, ngModel) {
        $scope.orderValue = {
            value: 'created',
            labelTranslateKey: 'global_filter.sort.orderby.created'
        };
        $scope.orderByOptions = {
            value: 'created',
            labelTranslateKey: 'global_filter.sort.orderby.filter_type_tag',
            options: [
                {
                    value: 'post_date',
                    labelTranslateKey: 'global_filter.sort.orderby.post_date'
                },
                {
                    value: 'updated',
                    labelTranslateKey: 'global_filter.sort.orderby.updated'
                },
                {
                    value: 'created',
                    labelTranslateKey: 'global_filter.sort.orderby.created'
                }
            ]
        };
        function activate() {
            ngModel.$render = renderModelValue;
            $scope.$watch('orderValue', saveToView, true);
        }
        function renderModelValue() {
            $scope.orderValue = {
                value: ngModel.$viewValue,
                labelTranslateKey: 'global_filter.sort.orderby.' + ngModel.$viewValue
            };
        }
        activate();
        function saveToView(orderGroup) {
            /** @DEVNOTE  this is not something we should need.
             * We should be consistently getting the same type here. FIX FIX FIX before we merge
            **/
            if (_.isUndefined(orderGroup.value)) {
                orderGroup = {value: orderGroup};
            }
            ngModel.$setViewValue(angular.copy(orderGroup.value));
        }
    }
}
