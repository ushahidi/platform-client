module.exports = OverflowToggleDirective;

OverflowToggleDirective.$inject = ['$parse'];
function OverflowToggleDirective($parse) {
    return {
        restrict: 'A',
        link: OverflowToggleController
    };

    function OverflowToggleController($scope, $element, $attrs) {
        var toggle = $element[0].querySelector('.form-field-toggle');
        var hasOverflow = angular.bind({}, $parse($attrs.hasOverflow), $scope);

        $scope.$watch(hasOverflow, function (hasOverflow) {
            $element.toggleClass('has-overflow', hasOverflow);
        });

        angular.element(toggle).on('click', function () {
            hasOverflow() ? $element.toggleClass('show-overflow') : '';
        });
    }
}

