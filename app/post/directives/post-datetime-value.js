module.exports = [ 'moment', '_', function (moment, _) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            value: '='
        },
        templateUrl: 'templates/posts/post-datetime.html',
        link: function ($scope) {
            // Split date time in time and date fields
            $scope.timeFormat = { format: 'HH:i' };
            $scope.dateFormat = { format: 'yyyy-mm-dd' };

            // If datetime is already set
            // set input values appropriately
            if($scope.value) {
                $scope.date = moment($scope.value).toDate();
                $scope.time = moment($scope.value).toDate();
            }

            $scope.$watch('date', function (newValue, oldValue){
                if ( newValue !== oldValue) {
                    // If date is set update model
                    if ($scope.date) {
                        var newDate = moment($scope.date);

                        // If value already set up date
                        // date portion
                        if ($scope.value) {
                            $scope.value = moment().utc($scope.value)
                                            .year(newDate.year())
                                            .month(newDate.month())
                                            .date(newDate.date())
                                            .utc();
                        } else {
                            // Set value
                            $scope.value = newDate.utc();
                        }
                    } else {
                        // If date is cleared clear current values
                        clearDatetimeValues();
                    }
                }
            }, true);

            $scope.$watch('time', function (newValue, oldValue){
                if ( newValue !== oldValue) {
                    // If time is set update model
                    if ($scope.time) {
                        var newTime = moment($scope.time);
                        // If value already set up date
                        // time portion
                        if ($scope.value) {
                            $scope.value = moment($scope.value)
                                        .hour(newTime.hour())
                                        .minute(newTime.minute())
                                        .utc();
                        } else {
                            // Set value
                            $scope.value = newTime.utc();
                        }
                    } else {
                        // If time is cleared clear current values
                        clearDatetimeValues();
                    }
                }
            }, true);

            function clearDatetimeValues() {
                $scope.value = null;
                $scope.date = null;
                $scope.time = null;
                $scope.timeChosen = null;
                $scope.dateChosen = null;
            }
        }
    };
}];
