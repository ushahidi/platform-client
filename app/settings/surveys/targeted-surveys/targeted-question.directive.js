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
        let exists = false;
        if ($scope.editQuestion.newQuestion && $scope.targetedSurvey.stepThree.questions) {
            exists = $scope.checkForDuplicate();
        }

        if (exists) {
            $scope.questionError = true;
            $scope.questionMessage = 'This question already exists';
        } else {
            $scope.questionError = false;
            $scope.addNewQuestion();
        }
    }
}
