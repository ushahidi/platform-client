module.exports = ModeContextFormFilterDirective;

ModeContextFormFilterDirective.$inject = [];
function ModeContextFormFilterDirective() {
    return {
        restrict: 'E',
        scope: {},
        controller: ModeContextFormFilter,
        templateUrl: 'templates/posts/views/mode-context-form-filter.html'
    };
}

ModeContextFormFilter.$inject = ['$scope', 'FormEndpoint'];
function ModeContextFormFilter($scope, FormEndpoint) {
    $scope.forms = [];
    $scope.selectedForms = [];

    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
    }
}
