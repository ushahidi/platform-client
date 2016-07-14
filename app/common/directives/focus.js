module.exports = Focus;

Focus.$inject = [
    '$timeout'
];

function Focus($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.focus, function (value) {
                if (value) {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
}
