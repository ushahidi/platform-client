module.exports = FilterPostOrderAscDescDirective;

FilterPostOrderAscDescDirective.$inject = [
    'moment',
    '$rootScope',
    '_'
];
function FilterPostOrderAscDescDirective(moment, $rootScope, _) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {},
        template: require('./filter-post-order-asc-desc.html'),
        link: FilterPostOrderAscDescLink
    };
    function FilterPostOrderAscDescLink($scope, $element, $attrs, ngModel) {
        $scope.selectedValue = {
            value: 'desc',
            labelTranslateKey: 'global_filter.sort.order.desc'};
        $scope.activeOrderOptions = {
            labelTranslateKey: 'global_filter.sort.order.filter_type_tag',
            options: [
                {
                    value: 'desc',
                    labelTranslateKey: 'global_filter.sort.order.desc'
                },
                {
                    value: 'asc',
                    labelTranslateKey: 'global_filter.sort.order.asc'
                }
            ]
        };
        //$scope.$watch('activeOrderOptions', saveToView, true);
        function activate() {
            ngModel.$render = renderModelValue;
            $scope.$watch('selectedValue', saveToViewSelected, true);
        }
        function renderModelValue() {
            $scope.selectedValue = {
                value: ngModel.$viewValue,
                labelTranslateKey: 'global_filter.sort.order.' + ngModel.$viewValue
            };
        }
        activate();
        function saveToViewSelected(orderGroup) {
            ngModel.$setViewValue(angular.copy(orderGroup ? orderGroup.value.toString() : ''), 'radio');
        }
    }
}
