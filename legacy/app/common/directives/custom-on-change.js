angular.module('ushahidi.common.custom-on-change', [])

.directive('customOnChange', function () {
    return {
        restricet: 'A',
        link: function ($scope, $element, $attrs) {
            var onChangeFunc = $scope.$eval($attrs.customOnChange);
            $element.bind('change', onChangeFunc);
        }
    };
});
