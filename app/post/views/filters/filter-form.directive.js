module.exports = FormSelectDirective;

FormSelectDirective.$inject = [];
function FormSelectDirective() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        controller: FormSelectController,
        templateUrl: 'templates/posts/views/filters/filter-form.html'
    };
}

FormSelectController.$inject = ['$scope', 'FormEndpoint'];
function FormSelectController($scope, FormEndpoint) {
    $scope.forms = [];

    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
        // todo select all if none
    }
}
