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
            labelTranslateKey: 'global_filter.sort.order.filter_type_tag'};
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
        $scope.$watch('selectedValue', saveToViewSelected, true);
        function saveToViewSelected(orderGroup) {
            console.log(ngModel);
            ngModel.$setViewValue(angular.copy(orderGroup ? orderGroup.value.toString() : ''), 'radio');
        }
    }
}
