module.exports = FilterPostOrderAscDescDirective;

FilterPostOrderAscDescDirective.$inject = [
    'moment',
    '$rootScope',
    '_',
    'PostActiveOrderOptions'
];
function FilterPostOrderAscDescDirective(moment, $rootScope, _, PostActiveOrderOptions) {
    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {},
        template: require('./filter-post-order-asc-desc.html'),
        link: FilterPostOrderAscDescLink
    };
    function FilterPostOrderAscDescLink($scope, $element, $attrs, ngModel) {
        $scope.activeOrderOptions = {
            value: 'desc',
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
        $scope.$watch('activeOrderOptions.value', saveToView, true);
        function saveToView(orderGroup) {
            ngModel.$setViewValue(angular.copy(orderGroup));
        }
    }
}
