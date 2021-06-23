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

    if (globalEmbed && ($attrs.embedOnly === 'false')) {
        $element.addClass('hidden');
    } else if (!globalEmbed && ($attrs.embedOnly === 'true')) {
        $element.addClass('hidden');
    }
}
