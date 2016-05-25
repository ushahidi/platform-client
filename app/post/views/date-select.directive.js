module.exports = DateSelectDirective;

DateSelectDirective.$inject = [];
function DateSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        controller: DateSelectController,
        templateUrl: 'templates/posts/views/date-select.html'
    };
}

DateSelectController.$inject = [];
function DateSelectController() {

}
