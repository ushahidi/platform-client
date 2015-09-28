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
                body = $document.find('body').eq(0),
                navClose = '<div class="close-nav"></div>',
                close_nav = '',
                wrapper = angular.element(document.getElementsByClassName('wrapper'));

            // Init isOpen state
            this.isOpen = false;

            this.toggle = function (open) {
                openScope.isOpen = arguments.length ? !!open : !openScope.isOpen;
                body.toggleClass(openClass, openScope.isOpen);

                if (openScope.isOpen) {
                    wrapper.append(navClose);
                    close_nav = angular.element(
                     document.getElementsByClassName('close-nav')
                    );
                    close_nav.bind('click', function () {
                        self.toggle(false);
                    });
                } else {
                    close_nav = angular.element(
                     document.getElementsByClassName('close-nav')
                    );
                    close_nav.remove();
                }

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
