/**
 * Focus directive.
 * Use this to set focus on input fields that may otherwise not have focus when they become available.
 */

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
