/**
 * Ushahidi Angular Modal directive
 * Based on the Angular Bootstrap Modal directive
 */
angular.module('ushahidi.common.modal', [])

.directive('modal', [
    '$translate',
    '$rootScope',
function (
    $translate,
    $rootScope
) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/modal/modal.html',

        scope: {
            title: '@?',
            icon: '=?',
            visible: '=?',
            closeOnOverlayClick: '=?',
            showCloseButton: '=?'
        },

        controller: ['$scope', '$attrs', '$parse', '$timeout', function ($scope, $attrs, $parse, $timeout) {
            $scope.iconPath = $scope.icon ? '../../img/iconic-sprite.svg#' + $scope.icon : '';

            var classChangePromise = null;
            $scope.iconPath = '../../img/iconic-sprite.svg#' + $scope.icon;
            $scope.classVisible = false;
            $scope.modalOffset = 0;
            $scope.title = $translate.instant($scope.title);

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
                        $scope.classVisible = true;
                        $rootScope.toggleModalVisible();

                        // Set offset based on window position
                        // @todo move offset to a config param
                        var windowYpos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
                        $scope.modalOffset = (windowYpos + 40) + 'px';
                        // @todo set max height
                        // $('.modal-body').css('max-height', $(window).height() * 0.66);

                        if (classChangePromise) {
                            $timeout.cancel(classChangePromise);
                        }
                    }
                } else if (state === false) {
                    if ($scope.classVisible) {
                        // Animate out.
                        $scope.classVisible = false;
                        $rootScope.toggleModalVisible();

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
}]);
