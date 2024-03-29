/**
 * Ushahidi Angular Modal directive
 * Based on the Angular Bootstrap Modal directive
 */
module.exports = ModalContainer;

ModalContainer.$inject = ['$timeout', '$rootScope', '$compile', 'ModalService', 'SliderService', 'FocusTrap'];
function ModalContainer($timeout, $rootScope, $compile, ModalService, SliderService, FocusTrap) {
    return {
        restrict: 'E',
        template: require('./modal-container.html'),

        scope: true,

        link: ModalContainerLink
    };

    function ModalContainerLink($scope, $element) {
        $scope.classVisible = false;
        $scope.modalOffset = 0;
        $scope.title = '';
        $scope.icon = false;
        $scope.closeOnOverlayClick = true; // Could move out of scope
        $scope.showCloseButton = true;
        // Callbacks
        $scope.closeButtonClicked = closeButtonClicked;
        $rootScope.$on('activate:modal-slider', () => {
            $scope.sliderOpen = true;
        });

        var templateScope;

        // Modal content element
        var modalContent = $element.find('modal-content');
        let trap = FocusTrap.createFocusTrap('.modal-window');

        // Bind to modal service open/close events
        ModalService.onOpen(openModal, $scope);
        ModalService.onClose(closeModal, $scope);

        //var classChangePromise = null;
        function makeTemplateScope(scope) {
            // If no scope was passed, create a child of our directive scope
            if (!scope) {
                // @todo should this just be $rootScope.$new() ??
                return $scope.$new();
            }

            // If scope isn't actually a scope yet, make it into one
            if (scope.constructor !== $rootScope.constructor) {
                return angular.extend($rootScope.$new(), scope);
            }

            return scope.$new();
        }

        function openModal(ev, template, title, icon, scope, closeOnOverlayClick, showCloseButton) {
            // Clean up any previous modal content
            cleanUpModal();
            // Create new scope and keep it to destroy when done with the modal
            templateScope = makeTemplateScope(scope);

            // Inject closeModal function onto template scope
            templateScope.closeModal = closeModal;

            modalContent.html(template);
            $compile(modalContent)(templateScope);

            // we need to check that the content is ready before activating the focus-trap
            angular.element(modalContent).ready(function () {
                trap.activate();
            });
            $scope.title = title;
            $scope.icon = icon ? '#' + icon : icon;

            // If closeOnOverlayClick isn't passed, default to true
            if (typeof closeOnOverlayClick === 'undefined') {
                $scope.closeOnOverlayClick = true;
            } else {
                $scope.closeOnOverlayClick = closeOnOverlayClick;
            }

            // If showCloseButton isn't passed, default to true
            if (typeof showCloseButton === 'undefined') {
                $scope.showCloseButton = true;
            } else {
                $scope.showCloseButton = showCloseButton;
            }

            // @todo fade in
            modalYPos();
            $scope.classVisible = true;
            ModalService.setState(true);
            $rootScope.toggleModalVisible(true);

            // if (classChangePromise) {
            //     $timeout.cancel(classChangePromise);
            // }
        }

        function closeModal() {
            // @todo fade out

            $scope.classVisible = false;
            $rootScope.toggleModalVisible(false);
            ModalService.setState(false);
            trap.deactivate();
            cleanUpModal();

            // if (classChangePromise) {
            //     $timeout.cancel(classChangePromise);
            // }

            // classChangePromise = $timeout(function () {
            //     $scope.classDetached = true;
            // }, 400);
        }

        function cleanUpModal() {
            if (templateScope) {
                templateScope.$destroy();
            }
            modalContent.html('');
        }

        function closeButtonClicked(context) {
            if (context === 'overlay' && $scope.closeOnOverlayClick !== true) {
                return;
            }
            SliderService.close();
            closeModal();
        }

        function modalYPos() {
            // Set offset based on window position
            // @todo move offset to a config param
            var windowYpos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            $scope.modalOffset = (windowYpos + 40) + 'px';
        }

        // $scope.$on('$destroy', function (event) {
        //     if (classChangePromise) {
        //         $timeout.cancel(classChangePromise);
        //     }
        // });
    }
}
