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
    'Notify',
    'MainsheetService',
    'PostSurveyService',
    '$location'
];
function AddPostButtonController(
    $scope,
    Notify,
    MainsheetService,
    PostSurveyService,
    $location
) {
    $scope.forms = [];
    $scope.disabled = true;
    $scope.handleClick = handleClick;

    activate();

    function activate() {
        getAvailableSurveys();
    }

    function getAvailableSurveys() {
        PostSurveyService
        .allowedSurveys()
        .then(function (forms) {
            $scope.forms = forms;
            if (forms.length > 0) {
                $scope.disabled = false;
            }
        }, function (errorResponse) {
            Notify.apiErrors(errorResponse);
        });
    }

    function handleClick() {
        if ($scope.forms.length === 1) {
            $location.path('/posts/create/' + $scope.forms[0].id);
        } else {
            MainsheetService.openTemplate(
                '<add-post-survey-list></add-post-survey-list>', 'app.submit_response', $scope
            );
        }
    }

}
