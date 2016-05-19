/**
 * Ushahidi Angular Confirmation Message directive
 * Based on the Angular Bootstrap Modal directive
 */
angular.module('ushahidi.common.notification-slider', [])

.directive('notificationSlider', function () {
    return {
        restrict: 'A',
        scope: {
            visible: '=notificationSlider'
        },

        controller: ['$scope', '$attrs', '$parse', '$timeout', function ($scope, $attrs, $parse, $timeout) {
            $scope.$watch('visible', function (state, previousState) {
                if (state === true) {
                    $timeout(function () {
                        $scope.visible = false;
                    }, 5000);
                }
            });
        }]
    };
})

;
