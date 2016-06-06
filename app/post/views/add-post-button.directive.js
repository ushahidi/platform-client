module.exports = AddPostButtonDirective;

AddPostButtonDirective.$inject = [];
function AddPostButtonDirective() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        controller: AddPostButtonController,
        templateUrl: 'templates/posts/views/add-post-button.html'
    };
}

AddPostButtonController.$inject = [
    '$scope',
    'FormEndpoint'
];
function AddPostButtonController(
    $scope,
	FormEndpoint
) {

    $scope.forms = [];
    $scope.fabToggle = false;
    
    activate();

    function activate() {
        // Load forms
        $scope.forms = FormEndpoint.query();
    }
}
