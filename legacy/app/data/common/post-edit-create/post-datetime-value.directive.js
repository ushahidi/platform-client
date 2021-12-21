module.exports = [
    'dayjs',
    'Flatpickr',
    '_',
    function (dayjs, Flatpickr, _) {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            require: 'ngModel',
            template: require('./post-datetime-value.html'),
            link: function ($scope, element, attrs, ngModel) {
                $scope.model = null;

                // If no ngModel, skip the rest
                if (!ngModel) {
                    return;
                }

                // Update models on render
                ngModel.$render = render;

                $scope.$watch('model', save);

                Flatpickr('#flatpickr', {
                    enableTime: true,
                    altInput: true,
                    altFormat: 'Y-m-d h:i K'
                });

                // Render ngModel viewValue into scope
                function render() {
                    if (ngModel.$viewValue.value !== null) {
                        $scope.model = dayjs(ngModel.$viewValue.value).toDate();
                    }
                }

                // Save model value
                // Only runs when modal closes, this avoids overwriting the time
                // and rounding it to 15mins, even when the user never changed it
                function save() {
                    let valueObject = {
                        value: dayjs($scope.model).toDate(),
                        value_meta: {
                            from_tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            offset: dayjs($scope.model).toDate().getTimezoneOffset()
                        }
                    }
                    ngModel.$setViewValue(valueObject);
                }
            }
        };
    }
];
