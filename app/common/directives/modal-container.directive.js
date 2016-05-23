/**
 * Ushahidi Angular Modal directive
 * Based on the Angular Bootstrap Modal directive
 */
module.exports = ModalContainer;

ModalContainer.$inject = ['$timeout', '$rootScope', '$templateRequest', '$compile', 'ModalService'];
function ModalContainer($timeout, $rootScope, $templateRequest, $compile, ModalService) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'templates/modal/modal-container.html',

        scope: true,

        link: ModalContainerLink
    }

    function ModalContainerLink($scope, $element) {
        $scope.classVisible = false;
        $scope.modalOffset = 0;
        $scope.title = '';
        $scope.closeOnOverlayClick = true; // Could move out of scope
        $scope.showCloseButton = true;
        // Callbacks
        $scope.closeButtonClicked = closeButtonClicked;

        // Modal content element
        var modalContent = $element.find('modal-content');

        // Bind to modal service open/close events
        ModalService.onOpen(openModal, $scope);
        ModalService.onClose(closeModal, $scope);

        //var classChangePromise = null;

        function openModal(ev, templateUrl, title, closeOnOverlayClick, showCloseButton) {
            // Load template markup
            $templateRequest(templateUrl).then(function (template) {
                modalContent.html(template);
                $compile(modalContent)($scope);

                $scope.title = title;

                // If closeOnOverlayClick isn't passed, default to true
                if (typeof closeOnOverlayClick === 'undefined') {
                    $scope.closeOnOverlayClick = true;
                }

                // If showCloseButton isn't passed, default to true
                if (typeof showCloseButton === 'undefined') {
                    $scope.showCloseButton = true;
                }

                // @todo fade in
                modalYPos();
                $scope.classVisible = true;
                $rootScope.toggleModalVisible();

                // if (classChangePromise) {
                //     $timeout.cancel(classChangePromise);
                // }
            });
        }

        function closeModal() {
            // @todo fade out
            $scope.classVisible = false;
            $rootScope.toggleModalVisible();

            // if (classChangePromise) {
            //     $timeout.cancel(classChangePromise);
            // }

            // classChangePromise = $timeout(function () {
            //     $scope.classDetached = true;
            // }, 400);
        }

        function closeButtonClicked(context) {
            if (context === 'overlay' && $scope.closeOnOverlayClick !== true) {
                return;
            }

            closeModal();
        };

        function modalYPos() {
            // Set offset based on window position
            // @todo move offset to a config param
            var windowYpos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
            $scope.modalOffset = (windowYpos + 40) + 'px';

            // @todo set max height
            // $('.modal-body').css('max-height', $(window).height() * 0.66);
        }

        // $scope.$on('$destroy', function (event) {
        //     if (classChangePromise) {
        //         $timeout.cancel(classChangePromise);
        //     }
        // });
    }
}
