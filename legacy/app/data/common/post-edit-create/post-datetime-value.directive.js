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

                $scope.$watch('model', function() {
                    console.log($scope.model)
                    save()
                });

                Flatpickr('#flatpickr', {
                    enableTime: true,
                    dateFormat: 'Z',
                    altInput: true,
                    altFormat: 'Y-m-d h:i K'

                });

                // Render ngModel viewValue into scope
                function render() {
                    if (ngModel.$viewValue !== null) {
                        $scope.model = dayjs(ngModel.$viewValue).toDate();
                    }
                }

                // Save model value
                // Only runs when modal closes, this avoids overwriting the time
                // and rounding it to 15mins, even when the user never changed it
                function save() {
                    ngModel.$setViewValue($scope.model);
                }
            }
        };
    }
];
