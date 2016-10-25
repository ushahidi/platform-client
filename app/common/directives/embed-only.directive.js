module.exports = EmbedOnlyDirective;

EmbedOnlyDirective.$inject = [];
function EmbedOnlyDirective() {
    return {
        restrict: 'A',
        controller: EmbedOnlyController
    };
}

EmbedOnlyController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '_', '$window'];
function EmbedOnlyController($scope, $element, $attrs, $rootScope, _, $window) {
    var globalEmbed = ($window.self !== $window.top) ? true : false;
    if (globalEmbed && $rootScope.globalLayout.indexOf('layout-embed') < 0) {
        // If layout-embed is not set append it to the global layout class
        $rootScope.setLayout($rootScope.globalLayout + ' layout-embed');
    }
    if (globalEmbed && ($attrs.embedOnly === 'false')) {
        $element.addClass('hidden');
    } else if (!globalEmbed && ($attrs.embedOnly === 'true')) {
        $element.addClass('hidden');
    }
}
