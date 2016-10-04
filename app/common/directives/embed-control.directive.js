module.exports = EmbedControlDirective;

EmbedControlDirective.$inject = [];
function EmbedControlDirective() {
    return {
        restrict: 'A',
        controller: EmbedControlController
    };
}

EmbedControlController.$inject = ['$scope', '$element', '$attrs', '$rootScope', '_'];
function EmbedControlController($scope, $element, $attrs, $rootScope, _) {
    if ($rootScope.globalEmbed && !$attrs.embedOnly) {
        $element.addClass('hidden');
    }
}
