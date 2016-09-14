module.exports = SurveyNotify;

var scope;

SurveyNotify.$inject = ['_', '$q', '$rootScope', '$translate', 'SliderService', 'ModalService'];
function SurveyNotify(_, $q, $rootScope, $translate, SliderService, ModalService) {
    return {
        success: success
    };

    function success(successText, translateValues, values) {
        var scope = getScope();

        function showSlider(successText) {
            values.successText = successText;
            scope = _.extend(scope, values);

            SliderService.openTemplate(require('./survey-success.html'), 'thumb-up', 'confirmation', scope, false, false);
        }

        $translate(successText, translateValues).then(showSlider, showSlider);
    }

    function getScope() {
        if (scope) {
            scope.$destroy();
        }
        scope = $rootScope.$new();
        return scope;
    }
}
