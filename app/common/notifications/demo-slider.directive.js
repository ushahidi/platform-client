/**
 * Demo-bar visible for Demo-plans
 * Based on the Angular Bootstrap Modal directive
 */
module.exports = DemoSlider;
DemoSlider.$inject = ['$compile', 'DemoSliderService', '$rootScope'];
function DemoSlider($compile, DemoSliderService, $rootScope) {
    return {
        restrict: 'E',
        template: require('./demo-slider.html'),
        scope: {
            loading: '=?'
        },
        link: DemoSliderLink
    };

    function DemoSliderLink($scope, $element) {
        $scope.classVisible = false;
        $scope.icon = false;
        $scope.iconClass = {};
        // Callbacks
        $scope.limitAvailability = false;

        $rootScope.$on('demo:limitAvailability', function (obj, expired, limitReached) {
            $scope.limitAvailability = !expired && !limitReached ? false : true;
        });

        var templateScope;
        var iconPath = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');
        // content element
        var demoSliderContent = $element.find('demo-slider-content');

        // Run clean up on scope destroy (probably never happens)
        $scope.$on('$destroy', cleanUp);

        // Bind to modal service open/close events
        DemoSliderService.onOpen(open, $scope);
        DemoSliderService.onClose(close, $scope);

        function open(ev, template, icon, iconClass, scope, loading) {
            $scope.loading = false;

            // Clean up any previous content
            cleanUp();
            // Create new scope and keep it to destroy when done with the
            templateScope = scope ? scope.$new() : $scope.$new();

            // Inject close function onto template scope
            templateScope.close = close;

            demoSliderContent.html(template);
            $compile(demoSliderContent)(templateScope);

            $scope.icon = icon ? iconPath + '#' + icon : icon;
            $scope.iconClass = {};
            if (iconClass) {
                $scope.iconClass[iconClass] = true;
            }

            // .. and finally open the slider!!
            $scope.classVisible = true;

            if (loading) {
                $scope.loading = true;
            }
        }

        function close() {
            // @todo fade out
            $scope.classVisible = false;
            cleanUp();
        }

        function cleanUp() {
            if (templateScope) {
                templateScope.$destroy();
            }
            demoSliderContent.html('');
        }
    }
}
