/**
 * Ushahidi Angular Confirmation Message directive
 * Based on the Angular Bootstrap Modal directive
 */
module.exports = Slider;
Slider.$inject = ['$timeout', '$compile', 'SliderService', 'ModalService'];
function Slider($timeout, $compile, SliderService, ModalService) {
    return {
        restrict: 'E',
        template: require('./slider.html'),
        scope: {
            insideModal: '@?'
        },
        link: SliderLink
    };

    function SliderLink($scope, $element) {
        $scope.classVisible = false;
        $scope.icon = false;
        $scope.iconClass = {};
        $scope.showCloseButton = true;
        $scope.closeOnNavigate = false;
        // Callbacks
        $scope.closeButtonClicked = closeButtonClicked;

        var templateScope;
        var closeTimeout = null;
        var iconPath = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');
        // content element
        var sliderContent = $element.find('slider-content');

        // Run clean up on scope destroy (probably never happens)
        $scope.$on('$destroy', cleanUp);

        // Close slider on navigation if feature enabled
        $scope.$on('$locationChangeStart', navigateClose);

        // Bind to modal service open/close events
        SliderService.onOpen(open, $scope);
        SliderService.onClose(close, $scope);

        function open(ev, template, icon, iconClass, scope, closeOnTimeout, showCloseButton, closeOnNavigate) {
            // If we're inside a modal, modal must be open
            if ((typeof $scope.insideModal !== 'undefined') !== ModalService.getState()) {
                // Ignore, the other slider can open
                return;
            }

            // Clean up any previous content
            cleanUp();
            // Create new scope and keep it to destroy when done with the
            templateScope = scope ? scope.$new() : $scope.$new();

            // Inject close function onto template scope
            templateScope.close = close;

            sliderContent.html(template);
            $compile(sliderContent)(templateScope);

            $scope.icon = icon ? iconPath + '#' + icon : icon;
            $scope.iconClass = {};
            if (iconClass) {
                $scope.iconClass[iconClass] = true;
            }

            // If showCloseButton isn't passed, default to true
            if (typeof showCloseButton === 'undefined') {
                $scope.showCloseButton = true;
            } else {
                $scope.showCloseButton = showCloseButton;
            }

            // If closeOnNavigate isn't passed, default to false
            if (typeof closeOnNavigate === 'undefined') {
                $scope.closeOnNavigate = false;
            } else {
                $scope.closeOnNavigate = closeOnNavigate;
            }

            // Default closeOnTimeout to true
            closeOnTimeout = (typeof closeOnTimeout !== 'undefined') ? closeOnTimeout : true;

            // .. and finally open the slider!!
            $scope.classVisible = true;
            // Set timeout to close in 5s
            if (closeOnTimeout) {
                closeTimeout = $timeout(close, 5000);
            }
        }

        function close() {
            // If we're inside a modal *and* the modal isn't open
            if ($scope.insideModal && !ModalService.getState()) {
                // Ignore, the other slider can open
                return;
            }
            // @todo fade out
            $scope.classVisible = false;
            cleanUp();
        }

        function cleanUp() {
            if (templateScope) {
                templateScope.$destroy();
            }
            if (closeTimeout) {
                $timeout.cancel(closeTimeout);
            }
            sliderContent.html('');
        }

        function navigateClose() {
            if ($scope.closeOnNavigate) {
                close();
            }
        }

        function closeButtonClicked(context) {
            close();
        }
    }

}
