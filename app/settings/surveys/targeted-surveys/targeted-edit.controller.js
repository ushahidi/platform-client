// re-route if feature flag is not enabled
module.exports = [
    '$scope',
    'Features',
    '$state',
    '_',
    'ModalService',
    'Sortable',
function (
    $scope,
    Features,
    $state,
    _,
    ModalService,
    Sortable
) {
    $scope.isActiveStep = isActiveStep;
    $scope.isStepComplete = isStepComplete;
    $scope.completeStepOne = completeStepOne;
    $scope.completeStepTwo = completeStepTwo;
    $scope.completeStepThree = completeStepThree;
    $scope.openQuestionModal = openQuestionModal;
    $scope.addNewQuestion = addNewQuestion;
    $scope.publish = publish;
    $scope.previousStep = previousStep;
    $scope.activeStep = 1;

    Features.loadFeatures()
           .then(() => {
            // WARNING: Add Feature Flag
            $scope.targetedSurveysEnabled = true;
            // $scope.targetedSurveysEnabled = Features.isFeatureEnabled('targeted-surveys');

            // reroute if feature-flag is not turned on
            if (!$scope.targetedSurveysEnabled) {
                $state.go('settings.surveys.create');
            }
        });

    // needed for Sortablejs and drag-drop in step 3
    let el = document.getElementById('listWithHandle');
    if (el) {
        Sortable.create(el, {
            handle: '.list-handle',
            animation: 150,
            onEnd: changeOrder
        });
    }

    function isActiveStep(step) {
        return $scope.activeStep === step;
    }

    function isStepComplete(step) {
        return step.$valid;
    }

    function changeOrder(evt) {
        var items = evt.to.children;
        _.each(items, function (item, index) {
            _.each($scope.targetedSurvey.stepThree.questions, function (question) {
                if (question.label === item.getAttribute('data')) {
                    /* WARNING! incrementing by 2 since there are 2 fields(attributes) before this,
                    the name of the survey and description, might change when api is figured out properly */
                    question.order = index + 2;
                }
            });
        });
    }

    function completeStepOne() {
        $scope.activeStep = 2;
    }

    function completeStepTwo() {
        // Insert validation for step 2 here
        $scope.activeStep = 3;
    }

    function completeStepThree() {
        // Insert validation for step 3 here
        $scope.activeStep = 4;
    }

    function openQuestionModal(question) {
        $scope.editQuestion = question ? question : {newQuestion: true};
        ModalService.openTemplate('<targeted-question></targeted-question>', 'survey.targeted_survey.edit_title', null, $scope, true, true);
    }

    function addNewQuestion() {
        ModalService.close();
        if (!$scope.targetedSurvey.stepThree.questions) {
            $scope.targetedSurvey.stepThree.questions = [];
        }
        // WARNING! Below might change depending on what info the api needs. Its now based on open-surveys
        $scope.editQuestion.input = 'textarea';
        $scope.editQuestion.order = getPriority($scope.targetedSurvey.stepThree.questions);
        $scope.editQuestion.type = 'text';
        // This is to avoid the 2-way binding and the label to update while writing in the modal
        $scope.editQuestion.label = angular.copy($scope.editQuestion.question);

        // This is to avoid adding same question twice and we don't have any unique id-s for the questions yet
        if ($scope.editQuestion.newQuestion) {
            delete $scope.editQuestion.newQuestion;
            $scope.targetedSurvey.stepThree.questions.push($scope.editQuestion);
        }
    }

    function getPriority(step) {
        return step && step.length > 0 ? _.last(step).order + 1 : 3;
    }

    function publish() {
        // Insert validation/safety-modal-check + publishing survey here
    }

    function previousStep() {
        $scope.activeStep = $scope.activeStep - 1;
    }
}];
