/**
 * Ushahidi Off Canvas Menu
 */

angular.module('ushahidi.common.offcanvas', [])

.constant('offCanvasConfig', {
    openClass : 'navigation-open'
})

.service('OffCanvasService', [function () {
    // Shared scope for all instances of off-canvas-toggle
    this.openScope = {
        isOpen : false
    };
}])

.directive('offCanvasToggle', function () {
    return {
        controller: ['$scope', 'offCanvasConfig', 'OffCanvasService', '$document', function ($scope, offCanvasConfig, OffCanvasService, $document) {
            var self = this,
                openScope = OffCanvasService.openScope,
                openClass = offCanvasConfig.openClass,
                body = $document.find('body').eq(0);

            // Init isOpen state
            this.isOpen = false;

            this.toggle = function (open) {
                openScope.isOpen = arguments.length ? !!open : !openScope.isOpen;
                body.toggleClass(openClass, openScope.isOpen);

                return openScope.isOpen;
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
