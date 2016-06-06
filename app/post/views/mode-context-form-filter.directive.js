module.exports = ModeContextFormFilterDirective;

ModeContextFormFilterDirective.$inject = [];
function ModeContextFormFilterDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: ModeContextFormFilter,
        templateUrl: 'templates/posts/views/mode-context-form-filter.html'
    };
}

ModeContextFormFilter.$inject = ['$scope', 'FormEndpoint'];
function ModeContextFormFilter($scope, FormEndpoint) {
    $scope.forms = [];
    $scope.showOnly = showOnly;
    $scope.hide = hide;

    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
    }

    function showOnly(formId) {
        $scope.filters.form.splice(0, $scope.filters.form.length, formId);
    }

    function hide(formId) {
        var index = $scope.filters.form.indexOf(formId);
        if (index !== -1) {
            $scope.filters.form.splice(index, 1);
        }
    }
}
