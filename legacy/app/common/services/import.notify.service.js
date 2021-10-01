module.exports = ImportNotify;

var scope;

ImportNotify.$inject = ['_', '$q', '$rootScope', '$translate', 'SliderService'];
function ImportNotify(_, $q, $rootScope, $translate, SliderService) {
    return {
        importComplete: importComplete
    };

    function importComplete(values) {
        var scope = getScope();

        scope = _.extend(scope, values);

        showSlider();

        function showSlider() {
            SliderService.openTemplate(require('./import-complete.html'), 'thumb-up', 'confirmation', scope, false, false);
        }
    }

    function getScope() {
        if (scope) {
            scope.$destroy();
        }
        scope = $rootScope.$new();
        return scope;
    }
}
