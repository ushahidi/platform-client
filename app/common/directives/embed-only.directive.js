EmbedOnlyDirective.$inject = [];
function EmbedOnlyDirective() {
    return {
        restrict: 'A',
        controller: EmbedOnlyController
    };
}

EmbedOnlyController.$inject = ['$scope', '$element', '$attrs','Embed'];
function EmbedOnlyController($scope, $element, $attrs, Embed) {
    if (Embed.isEmbed && ($attrs.embedOnly === 'false')) {
        $element.addClass('hidden');
    } else if (!Embed.isEmbed && ($attrs.embedOnly === 'true')) {
        $element.addClass('hidden');
    }
}

module.exports = EmbedOnlyDirective;
