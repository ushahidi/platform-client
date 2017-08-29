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
    '$location'
];

function AddPostSurveyListController(
    $scope,
    $location
) {

    $scope.handleClick = handleClick;

    function handleClick(form) {
        $scope.closeMainsheet();
        $location.path('posts/create/' + form.id);
    }

}
