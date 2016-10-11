module.exports = EmbedOnlyDirective;

EmbedOnlyDirective.$inject = [];
function EmbedOnlyDirective() {
    return {
        restrict: 'A',
        controller: EmbedOnlyController
    };
}

EmbedOnlyController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '_'];
function EmbedOnlyController($scope, $element, $attrs, $rootScope, _) {
    if ($rootScope.globalEmbed && !$attrs.embedOnly) {
        $element.addClass('hidden');
    } else if (!$rootScope.globalEmbed && $attrs.embedOnly) {
        $element.addClass('hidden');
    }
}
