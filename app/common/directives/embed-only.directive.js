import isEmbed from '../services/isEmbed';

EmbedOnlyDirective.$inject = [];
function EmbedOnlyDirective() {
    return {
        restrict: 'A',
        controller: EmbedOnlyController
    };
}

EmbedOnlyController.$inject = ['$scope', '$element', '$attrs'];
function EmbedOnlyController($scope, $element, $attrs) {
    if (isEmbed() && ($attrs.embedOnly === 'false')) {
        $element.addClass('hidden');
    } else if (!isEmbed() && ($attrs.embedOnly === 'true')) {
        $element.addClass('hidden');
    }
}

module.exports = EmbedOnlyDirective;
