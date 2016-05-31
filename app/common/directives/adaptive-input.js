/**
 * Ushahidi adaptive input directive
 * For the moment, the input element that this
 * directive is applied to expects that it's parent should be of
 * type form-field-adaptive,
 */

angular.module('ushahidi.common.adaptive-input',[])

.directive('adaptiveForm', function () {
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
})

.directive('adaptiveInput', function () {
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
                $event.preventDefault();
                adaptiveController.classAdd('focus');
            }

            function focusOff($event) {
                $event.preventDefault();
                adaptiveController.classRemove('focus');
                !$element.val() ? adaptiveController.classRemove('value')  : '';
            }
        }
    };
});
