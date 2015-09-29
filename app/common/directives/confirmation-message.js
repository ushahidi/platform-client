/**
 * Ushahidi Angular Confirmation Message directive
 * Based on the Angular Bootstrap Modal directive
 */
angular.module('ushahidi.common.confirmation-message', [])

.directive('confirmationMessage', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/confirmation-message/confirmation-message.html',

        scope: {
            title: '@?',
            visible: '=?',
            showCloseButton: '=?'
        },

        controller: ['$scope', '$attrs', '$parse', '$timeout', function ($scope, $attrs, $parse, $timeout) {

            $scope.classVisible = false;

            // If showCloseButton isn't passed, default to true
            if (typeof $scope.showCloseButton === 'undefined') {
                $scope.showCloseButton = true;
            }

            $scope.$watch('visible', function (state, previousState) {
                if (state === true) {
                    if (!$scope.classVisible) {
                        // Animate in.
                        $scope.classDetached = false;
                        $scope.classVisible = true;
                    }
                } else if (state === false) {
                    if ($scope.classVisible) {
                        // Animate out.
                        $scope.classVisible = false;
                    }
                }
            });

            $scope.closeConfirm = function (context) {

                $scope.visible = false;
            };

/*            $scope.$on('$destroy', function (event) {
                if (classChangePromise) {
                    $timeout.cancel(classChangePromise);
                }
            });
*/
        }]
    };
})

;
