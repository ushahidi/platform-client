module.exports = DateSelectDirective;

DateSelectDirective.$inject = [];
function DateSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            dateBeforeModel: '=',
            dateAfterModel: '='
        },
        controller: DateSelectController,
        template: require('./filter-date.html')
    };
}

DateSelectController.$inject = ['$scope', '$rootScope', 'Flatpickr'];
function DateSelectController($scope, $rootScope, Flatpickr) {
    let pickers = Flatpickr('.flatpickr', {});

    function pauseTrap() {
        $rootScope.$broadcast('event:pauseTrap', true);
    }

    function unPauseTrap() {
        $rootScope.$broadcast('event:pauseTrap', false);
    }

    // There are multiple pickers because of start/end-date in filters
    pickers.forEach((picker) => {
        if (picker.config) {
            if (picker.config.onOpen) {
                picker.config.onOpen.push(pauseTrap);
            }
            if (picker.config.onClose) {
                picker.config.onClose.push(unPauseTrap);
            }
        }
    });
}
