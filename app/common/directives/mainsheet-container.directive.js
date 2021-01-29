module.exports = MainsheetContainer;

MainsheetContainer.$inject = ['$rootScope', '$compile', 'MainsheetService', 'FocusTrap'];

function MainsheetContainer($rootScope, $compile, MainsheetService, FocusTrap) {
    return {
        restrict: 'E',
        scope: true,
        template: require('./mainsheet-container.html'),
        link: MainsheetContainerLink
    };

    function MainsheetContainerLink($scope, $element) {

        $scope.closeMainsheet = closeMainsheet;
        $scope.showMainsheet = false;
        $scope.title = '';

        var templateScope;

        // Mainsheet content element
        var mainsheetContent = $element.find('mainsheet-content');
        let trap = FocusTrap.createFocusTrap('.mainsheet-window');

        // Bind to mainsheet service open/close events
        MainsheetService.onOpen(openMainsheet, $scope);
        MainsheetService.onClose(closeMainsheet, $scope);

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

        function openMainsheet(event, template, title, scope, showCloseButton) {

            // Clean up any previous mainsheet content
            cleanUpMainsheet();

            // Create new scope and keep it to destroy when done with the mainsheet
            templateScope = makeTemplateScope(scope);

            // Inject closeMainsheet function onto template scope
            templateScope.closeMainsheet = closeMainsheet;

            mainsheetContent.html(template);
            $compile(mainsheetContent)(templateScope);

            angular.element(mainsheetContent).ready(function () {
                trap.activate();
            });
            $scope.title = title;

            // If showCloseButton isn't passed, default to true
            if (typeof showCloseButton === 'undefined') {
                $scope.showCloseButton = true;
            } else {
                $scope.showCloseButton = showCloseButton;
            }

            $scope.showMainsheet = true;
            MainsheetService.setState(true);
        }

        function closeMainsheet() {
            $scope.showMainsheet = false;
            MainsheetService.setState(false);
            trap.deactivate();
            cleanUpMainsheet();
        }

        function cleanUpMainsheet() {
            if (templateScope) {
                templateScope.$destroy();
            }
            mainsheetContent.html('');
        }
    }
}
