/**
 * Ushahidi Angular Modal directive
 * Based on the Angular Bootstrap Modal directive
 */
angular.module('ushahidi.common.modal', [])

.directive('modal', function () {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/modal/modal.html',

        scope: {
            title: '@?',
            visible: '=?',
            closeOnOverlayClick: '=?',
            showCloseButton: '=?'
        },

        controller: ['$scope', '$attrs', '$parse', '$timeout', function ($scope, $attrs, $parse, $timeout) {
            var classChangePromise = null;

            $scope.classDetached = true;
            $scope.classVisible = false;
            $scope.modalOffset = 0;

            // If closeOnOverlayClick isn't passed, default to true
            if (typeof $scope.closeOnOverlayClick === 'undefined') {
                $scope.closeOnOverlayClick = true;
            }

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

                        // Set offset based on window position
                        // @todo move offset to a config param
                        var windowYpos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                        $scope.modalOffset = (windowYpos + 40) + 'px';

                        if (classChangePromise) {
                            $timeout.cancel(classChangePromise);
                        }
                    }
                } else if (state === false) {
                    if ($scope.classVisible) {
                        // Animate out.
                        $scope.classVisible = false;

                        if (classChangePromise) {
                            $timeout.cancel(classChangePromise);
                        }

                        classChangePromise = $timeout(function () {
                            $scope.classDetached = true;
                        }, 400);
                    }
                }
            });

            $scope.closeModal = function (context) {
                if (context === 'overlay' && $scope.closeOnOverlayClick !== true) {
                    return;
                }

                $scope.visible = false;
            };

            $scope.$on('$destroy', function (event) {
                if (classChangePromise) {
                    $timeout.cancel(classChangePromise);
                }
            });
        }]
    };
})

;
