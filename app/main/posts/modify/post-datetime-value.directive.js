module.exports = ['moment', '_', function (moment, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: 'ngModel',
        template: require('./post-datetime-value.html'),
        link: function ($scope, element, attrs, ngModel) {
            // Split date time in time and date fields
            $scope.timeFormat = { format: 'HH:i' };
            $scope.dateFormat = { format: 'yyyy-mm-dd' };
            $scope.model = null;
            $scope.date = null;
            $scope.time = null;
            $scope.timeChosen = null;
            $scope.dateChosen = null;

            // If no ngModel, skip the rest
            if (!ngModel) {
                return;
            }

            // Update models on render
            ngModel.$render = render;
            // Watch time and date
            $scope.$watch('date', updateDate, true);
            $scope.$watch('time', updateTime, true);

            // Render ngModel viewValue into scope
            function render() {
                $scope.model = ngModel.$viewValue;

                // If datetime is already set
                // set input values appropriately
                if (ngModel.$viewValue) {
                    $scope.date = moment(ngModel.$viewValue).toDate();
                    $scope.time = moment(ngModel.$viewValue).toDate();
                } else {
                    clearDatetimeValues();
                }
            }

            // Update model + viewValue from date
            function updateDate(newValue, oldValue) {
                if (newValue !== oldValue) {
                    // If date is set update model
                    if ($scope.date) {
                        var newDate = moment($scope.date);

                        // If value already set up date
                        // date portion
                        if ($scope.model) {
                            $scope.model = moment().utc($scope.model)
                                            .year(newDate.year())
                                            .month(newDate.month())
                                            .date(newDate.date())
                                            .utc();
                        } else {
                            // Set value
                            $scope.model = newDate.utc();
                        }
                    } else {
                        // If date is cleared clear current values
                        clearDatetimeValues();
                    }
                    // Copy model to view value
                    ngModel.$setViewValue($scope.model);
                }
            }

            // Update model + viewValue from time
            function updateTime(newValue, oldValue) {
                if (newValue !== oldValue) {
                    // If time is set update model
                    if ($scope.time) {
                        var newTime = moment($scope.time);
                        // If value already set up date
                        // time portion
                        if ($scope.model) {
                            $scope.model = moment($scope.model)
                                        .hour(newTime.hour())
                                        .minute(newTime.minute())
                                        .utc();
                        } else {
                            // Set value
                            $scope.model = newTime.utc();
                        }
                    } else {
                        // If time is cleared clear current values
                        clearDatetimeValues();
                    }
                    // Copy model to view value
                    ngModel.$setViewValue($scope.model);
                }
            }

            // Clear all values
            function clearDatetimeValues() {
                $scope.model = null;
                $scope.date = null;
                $scope.time = null;
                $scope.timeChosen = null;
                $scope.dateChosen = null;
            }
        }
    };
}];
