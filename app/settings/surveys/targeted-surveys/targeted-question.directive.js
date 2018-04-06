module.exports = TargetedQuestionDirective;

TargetedQuestionDirective.$inject = [];
function TargetedQuestionDirective() {
    return {
        restrict: 'E',
        link: TargetedQuestionLink,
        template: require('./targeted-question-modal.html')
    };
}

function TargetedQuestionLink($scope, $element, $attrs) {
    $scope.charactersRemaining = charactersRemaining;
    $scope.removeError = removeError;
    $scope.save = save;

    function charactersRemaining() {
        if ($scope.editQuestion.question === undefined || $scope.editQuestion.question.length === 0) {
            $scope.error = $scope.editQuestion.question !== undefined ?  true : false;
            $scope.message = 'You need to add a question.';
            return 160;
        } else {
            $scope.error = $scope.editQuestion.question.length < 160 ? false : true;
            $scope.message = 'Your question is too long, you can use maximum 160 characters.';
            return 160 - $scope.editQuestion.question.length;
        }
    }
    function removeError() {
        $scope.questionError = false;
    }

    function save() {
        if ($scope.editQuestion.newQuestion && $scope.survey.attributes && $scope.checkForDuplicate()) {
            $scope.questionError = true;
            $scope.questionMessage = 'This question already exists';
        } else if (!$scope.editQuestion.question || !$scope.editQuestion.question.length) {
            $scope.questionError = true;
            $scope.questionMessage = 'You need to add a question';
        } else if (!$scope.questionError) {
            $scope.addNewQuestion();
        }
    }
}
