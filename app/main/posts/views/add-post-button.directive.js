module.exports = AddPostButtonDirective;

AddPostButtonDirective.$inject = [];
function AddPostButtonDirective() {
    return {
        restrict: 'E',
        scope: true,
        replace: true,
        controller: AddPostButtonController,
        template: require('./add-post-button.html')
    };
}

AddPostButtonController.$inject = [
    '$scope',
    '$rootScope',
    'PostSurveyService',
    '$location'
];
function AddPostButtonController(
    $scope,
    $rootScope,
    PostSurveyService,
    $location
) {
    $scope.forms = [];
    $scope.fabToggle = false;
    $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
    $scope.toggleFab = toggleFab;
    $scope.disabled = true;

    activate();

    function activate() {
        // Load forms
        PostSurveyService.allowedSurveys()
            .then(function (forms) {
                $scope.forms = forms;
                if (forms.length > 0) {
                    $scope.disabled = false;
                }
            });

        $rootScope.$on('post:list:selected', handlePostSelected);
    }

    function toggleFab() {
        if ($scope.forms.length === 1) {
            $location.path('/posts/create/' + $scope.forms[0].id);
        } else {
            $scope.fabToggle = !$scope.fabToggle;
            if ($scope.fabToggle) {
                $scope.fabOptionsStyle = { opacity: 1, display: 'flex' };
            } else {
                $scope.fabOptionsStyle = { opacity: 0, display: 'none' };
            }
        }
    }

    function handlePostSelected(event, selectedPosts) {
        $scope.disabled = selectedPosts.length > 0;
    }
}
