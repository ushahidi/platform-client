module.exports = PostViewCreate;

PostViewCreate.$inject = [];

function PostViewCreate() {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        controller: PostViewCreateController
    };
}
PostViewCreateController.$inject = ['$rootScope', '$scope', 'PostSurveyService', 'MainsheetService', '$location', 'Notify'];

function PostViewCreateController($rootScope, $scope, PostSurveyService, MainsheetService, $location, Notify) {
    // resetting path to map-view when mainsheet-modal is closed
    $rootScope.$on('mainsheet:statechange', function () {
                if (MainsheetService.getState() && $location.path() === '/views/create') {
                    $location.path('/views/map');
                }
            });

    activate();
    function activate() {
        PostSurveyService
            .allowedSurveys()
            .then(function (forms) {
                $scope.forms = forms;
                if (forms.length > 0) {
                    $scope.disabled = false;
                }
                if ($scope.forms.length === 1) {
                    $location.path('/posts/create/' + $scope.forms[0].id);
                } else {
                    MainsheetService.openTemplate(
                    '<add-post-survey-list></add-post-survey-list>', 'app.submit_response', $scope
                );
                }
            }, function (errorResponse) {
                Notify.apiErrors(errorResponse);
            });
    }
}
