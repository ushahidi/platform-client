/**
 * Ushahidi adaptive input directive
 * The adaptive-form attribute should be added to the parent div that
 * will receive the class updates.
 * The adaptive-input attribute should be added to a child input of the above
 * div
 */

angular.exports = AdaptiveForm;

AdaptiveForm.$inject = [];

function AdaptiveForm() {
    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {

            this.classAdd = function(className) {
                $element.addClass(className);
            };
            this.classRemove = function(className) {
                $element.removeClass(className);
            };
        }
    };
}

angular.exports = AdaptiveInput;

AdaptiveInput.$inject = [];

function AdaptiveInput(){
    return {
        require: '?^adaptiveForm',
        restrict: 'A',
        link: function ($scope, $element, $attrs, adaptiveController){

            activate();

            function activate () {
                $element.bind('focus', focusOn);
                $element.bind('blur', focusOff);
            }

            // Check on initial load if field has value
            // If so set focus
            $scope.$watch($attrs.ngModel, function (value){
                value ? adaptiveController.classAdd('value') : '';
            });

            function focusOn($event) {
                adaptiveController.classAdd('focus');
            }

            function focusOff($event) {
                adaptiveController.classRemove('focus');
                !$element.val() ? adaptiveController.classRemove('value')  : '';
            }
        }
    };
}
