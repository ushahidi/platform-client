module.exports = ModeContextFormFilterDirective;

ModeContextFormFilterDirective.$inject = [];
function ModeContextFormFilterDirective() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
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
        $scope.model.splice(0, $scope.model.length, formId);
    }

    function hide(formId) {
        var index = $scope.model.indexOf(formId);
        if (index !== -1) {
            $scope.model.splice(index, 1);
        }
    }
}
