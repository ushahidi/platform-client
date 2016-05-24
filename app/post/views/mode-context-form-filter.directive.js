module.exports = ModeContextFormFilterDirective;

ModeContextFormFilterDirective.$inject = [];
function ModeContextFormFilterDirective() {
    return {
        restrict: 'E',
        scope: {},
        controller: FormFilterController,
        templateUrl: 'templates/posts/views/mode-context-form-filter.html'
    };
}

FormFilterController.$inject = [];
function FormFilterController() {

}
