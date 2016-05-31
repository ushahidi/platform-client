/**
 * Ushahidi adaptive input directive
 * For the moment, the input element that this
 * directive is applied to expects that it's parent should be of
 * type form-field-adaptive,
 */

module.exports = AdaptiveInput;

AdaptiveInput.$inject = [];
function AdaptiveInput() {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){

            activate();

            function activate () {
                $element.bind('focus', focusOn);
                $element.bind('blur', focusOff);
            }

            // Check on initial load if field has value
            // If so set focus
            $scope.$watch('$element.val()', function (){
                $element.val() ? $element.parent().addClass('focus') : '';
            });

            function focusOn($event) {
                $event.preventDefault();
                $element.parent().addClass('focus');
            }

            function focusOff($event) {
                $event.preventDefault();
                !$element.val() ? $element.parent().removeClass('focus') : '';
            }
        }
    };
}
