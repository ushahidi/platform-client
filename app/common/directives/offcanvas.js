/**
 * Ushahidi Off Canvas Menu
 */

angular.module('ushahidi.common.offcanvas', [])

.constant('offCanvasConfig', {
    openClass : 'navigation-open'
})

.directive('offCanvasToggle', function () {
    return {
        controller: ['$scope', '$element', '$attrs', 'offCanvasConfig', '$document', function ($scope, $element, $attrs, offCanvasConfig, $document) {
            var self = this,
              openClass = offCanvasConfig.openClass,
              body = $document.find('body').eq(0);

            this.toggle = function (open) {
                $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
                body.toggleClass(openClass);
                return $scope.isOpen;
            };

            $scope.$on('$locationChangeSuccess', function () {
                self.toggle(false);
            });
        }],
        link: function (scope, element, attrs, canvasCtrl) {
            if (!canvasCtrl) {
                return;
            }

            var toggle = function (event) {
                event.preventDefault();
                canvasCtrl.toggle();
            };

            element.bind('click', toggle);

            scope.$on('$destroy', function () {
                element.unbind('click', toggle);
            });
        }
    };
});
