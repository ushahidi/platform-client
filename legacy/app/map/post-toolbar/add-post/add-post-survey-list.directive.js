module.exports = AddPostSurveyListDirective;

AddPostSurveyListDirective.$inject = [];

function AddPostSurveyListDirective() {
    return {
        restrict: 'E',
        scope: true,
        controller: AddPostSurveyListController,
        template: require('./add-post-survey-list.html')
    };
}

AddPostSurveyListController.$inject = [
    '$scope',
    '$location',
    'TranslationService'
];

function AddPostSurveyListController(
    $scope,
    $location,
    TranslationService
) {

    $scope.handleClick = handleClick;
    TranslationService.getLanguage().then(language=>{
        $scope.userLanguage = language;
    });

    function handleClick(form) {
        $scope.closeMainsheet();
        $location.path('posts/create/' + form.id);
    }

}
