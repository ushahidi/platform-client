module.exports = [
    "moment",
    "Flatpickr",
    "_",
    function (moment, Flatpickr, _) {
        return {
            restrict: "E",
            replace: true,
            scope: {},
            require: "ngModel",
            template: require("./post-datetime-value.html"),
            link: function ($scope, element, attrs, ngModel) {
                // Split date time in time and date fields
                $scope.timeOptions = {
                    format: "HH:i",
                    interval: 15,
                    onClose: save,
                };
                $scope.dateOptions = { format: "yyyy-mm-dd", onClose: save };
                $scope.model = null;

                // If no ngModel, skip the rest
                if (!ngModel) {
                    return;
                }

                // Update models on render
                ngModel.$render = render;
                Flatpickr("#flatpickr", {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    onChange: function (selectedDates, dateStr, instance) {
                        $scope.model = dateStr;
                        save();
                    },
                });

                // Render ngModel viewValue into scope
                function render() {
                    if (ngModel.$viewValue !== null) {
                        $scope.model = moment(ngModel.$viewValue).toDate();
                    }
                }

                // Save model value
                // Only runs when modal closes, this avoids overwriting the time
                // and rounding it to 15mins, even when the user never changed it
                function save() {
                    ngModel.$setViewValue($scope.model);
                }
            },
        };
    },
];
