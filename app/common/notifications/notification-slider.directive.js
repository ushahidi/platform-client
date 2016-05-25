/**
 * Ushahidi Angular Confirmation Message directive
 * Based on the Angular Bootstrap Modal directive
 */
module.exports = NotificationSlider;

function NotificationSlider() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/notification-slider/notification-slider.html',

        scope: {
            visible: '=?'
        },

        controller: ['$scope', '$attrs', '$parse', '$timeout', function ($scope, $attrs, $parse, $timeout) {
            var classChangePromise = null;

            $scope.classVisible = false;

            $scope.$watch('visible', function (state, previousState) {
                if (state === true) {
                    if (!$scope.classVisible) {
                        // Animate in.
                        $scope.classVisible = true;
                        classChangePromise = $timeout(function () {
                            $scope.visible = false;
                        }, 5000);
                    }
                } else if (state === false) {
                    if ($scope.classVisible) {
                        // Animate out.
                        $scope.classVisible = false;

                        if (classChangePromise) {
                            $timeout.cancel(classChangePromise);
                        }
                    }
                }
            });

            $scope.$on('$destroy', function (event) {
                if (classChangePromise) {
                    $timeout.cancel(classChangePromise);
                }
            });

        }]
    };
}
