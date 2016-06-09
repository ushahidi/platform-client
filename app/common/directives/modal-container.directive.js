/**
 * Ushahidi Angular Modal directive
 * Based on the Angular Bootstrap Modal directive
 */
module.exports = ModalContainer;

ModalContainer.$inject = ['$timeout', '$rootScope', '$compile', 'ModalService'];
function ModalContainer($timeout, $rootScope, $compile, ModalService) {
    return {
        restrict: 'E',
        templateUrl: 'templates/modal/modal-container.html',

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

        var templateScope;
        var iconPath = '../../img/iconic-sprite.svg#';
        // Modal content element
        var modalContent = $element.find('modal-content');

        // Bind to modal service open/close events
        ModalService.onOpen(openModal, $scope);
        ModalService.onClose(closeModal, $scope);

        //var classChangePromise = null;

        function openModal(ev, template, title, icon, scope, closeOnOverlayClick, showCloseButton) {
            // Clean up any previous modal content
            cleanUpModal();
            // Create new scope and keep it to destroy when done with the modal
            templateScope = scope ? scope.$new() : $scope.$new();

            // Inject closeModal function onto template scope
            templateScope.closeModal = closeModal;

            modalContent.html(template);
            $compile(modalContent)(templateScope);

            $scope.title = title;
            $scope.icon = icon ? iconPath + icon : icon;

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
