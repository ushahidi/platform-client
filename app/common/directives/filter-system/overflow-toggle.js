module.exports = OverflowToggleDirective;

OverflowToggleDirective.$inject = [];
function OverflowToggleDirective() {
    return {
        restrict: 'A',
        scope: {
            hasOverflow: '&'
        },
        link: OverflowToggleController
    };
}

function OverflowToggleController($scope, $element) {
    var toggle = $element[0].querySelector('.form-field-toggle');

    $scope.$watch($scope.hasOverflow, function (hasOverflow) {
        $element.toggleClass('has-overflow', hasOverflow);
    });

    angular.element(toggle).on('click', function () {
        $scope.hasOverflow() ? $element.toggleClass('show-overflow') : '';
    });
}
