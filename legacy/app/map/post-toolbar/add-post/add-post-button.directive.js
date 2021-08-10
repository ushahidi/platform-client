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
    '$location',
    '$rootScope'
];
function AddPostButtonController(
    $scope,
    Notify,
    MainsheetService,
    PostSurveyService,
    $location,
    $rootScope
) {
    $scope.forms = [];
    $scope.disabled = true;
    $scope.handleClick = handleClick;
    // this is to add a class for adjustment of the fab-button in data-view when demo-bar is visible.
    $scope.upgradeButton = $rootScope.demoBarVisible && $rootScope.loggedin;

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
