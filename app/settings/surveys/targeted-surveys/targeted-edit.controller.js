import { isValidNumber } from 'libphonenumber-js';
// re-route if feature flag is not enabled
module.exports = [
    '$scope',
    'Features',
    '$state',
    '_',
    'ModalService',
    'Sortable',
    'ConfigEndpoint',
    'Notify',
    'FormEndpoint',
    'FormStageEndpoint',
    'FormAttributeEndpoint',
    '$q',
    'PostFilters',
    'LoadingProgress',
    'CountryCodeEndpoint',
    '$translate',
function (
    $scope,
    Features,
    $state,
    _,
    ModalService,
    Sortable,
    ConfigEndpoint,
    Notify,
    FormEndpoint,
    FormStageEndpoint,
    FormAttributeEndpoint,
    $q,
    PostFilters,
    LoadingProgress,
    CountryCodeEndpoint,
    $translate
) {
    $scope.isActiveStep = isActiveStep;
    $scope.isStepComplete = isStepComplete;
    $scope.completeStepOne = completeStepOne;
    $scope.completeStepTwo = completeStepTwo;
    $scope.completeStepThree = completeStepThree;
    $scope.openQuestionModal = openQuestionModal;
    $scope.checkForDuplicate = checkForDuplicate;
    $scope.addNewQuestion = addNewQuestion;
    $scope.deleteQuestion = deleteQuestion;
    $scope.publish = publish;
    $scope.getPublishDescription = getPublishDescription;
    $scope.previousStep = previousStep;
    $scope.activeStep = 1;
    $scope.stepOneWarning = false;
    $scope.stepTwoWarning = false;
    $scope.stepThreeWarning = false;
    $scope.publish = publish;
    $scope.previousStep = previousStep;
    $scope.activeStep = 1;
    $scope.selectedCountry;
    $scope.textBoxNumbers = '';
    $scope.validatedNumbers = [];
    $scope.badCount = 0;
    $scope.recipientCount = 0;
    $scope.resetNumbers = resetNumbers;
    $scope.finalNumbers = {
            goodNumbers: [],
            goodNumbersString: '',
            badNumbersString: '',
            repeatCount: 0,
            storageObj: {},
            badNumberCount: 0
        };
    $scope.runValidations = runValidations;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.getCountryCodes = getCountryCodes;
    $scope.countriesList = [];

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
        if (isStepComplete($scope.targetedSurvey.stepOne)) {
            $scope.activeStep = 2;
            $scope.stepOneWarning = false;
            $scope.getCountryCodes();
        } else {
            $scope.stepOneWarning = true;
        }
    }

    function runValidations(numbers) {
        $scope.finalNumbers.badNumbersString = '';
        $scope.finalNumbers.badNumberCount = 0;
        let numbersArray = numbers.split(',');
        numbersArray.forEach((entry) => {
            let number = entry.replace(/\s/g, '');
            if (!isValidNumber(number, $scope.selectedCountry.country_code) && number.length) {
                $scope.finalNumbers.badNumbersString = $scope.finalNumbers.badNumbersString + number + ',';
                $scope.finalNumbers.badNumberCount = $scope.finalNumbers.badNumberCount + 1;
            } else if (isValidNumber(number, $scope.selectedCountry.country_code) && number.length) {
                if ($scope.finalNumbers.storageObj[number]) {
                    $scope.finalNumbers.repeatCount = $scope.finalNumbers.repeatCount + 1;
                } else {
                    $scope.finalNumbers.storageObj[number] = number;
                    $scope.finalNumbers.goodNumbers.push(number);
                    $scope.finalNumbers.goodNumbersString = $scope.finalNumbers.goodNumbersString + number + ',';
                }
            }
        });
    }

    function completeStepTwo() {
        if (isStepComplete($scope.targetedSurvey.stepTwo) && $scope.selectedCountry !== undefined && $scope.selectedCountry !== null) {
            $scope.stepTwoWarning = false;
            runValidations($scope.textBoxNumbers);
            if ($scope.finalNumbers.badNumbersString.length) {
                $scope.textBoxNumbers = $scope.finalNumbers.badNumbersString.slice(0, -1);
            } else {
                $scope.textBoxNumbers = $scope.finalNumbers.goodNumbersString.slice(0, -1);
                $scope.recipientCount = $scope.finalNumbers.goodNumbers.length;
                $scope.activeStep = 3;
            }
        } else {
            $scope.stepTwoWarning = true;
        }
    }

    function resetNumbers() {
        $scope.finalNumbers = {
            goodNumbers: [],
            goodNumbersString: '',
            badNumbersString: '',
            repeatCount: 0,
            storageObj: {},
            badNumberCount: 0
        };
    }

    function completeStepThree() {
        if ($scope.targetedSurvey.stepThree.questions !== undefined && $scope.targetedSurvey.stepThree.questions.length) {
            $scope.stepThreeWarning = false;
            $scope.activeStep = 4;
            calculateStats();
        } else {
            $scope.stepThreeWarning = true;
        }
    }
    function calculateStats() {
        ConfigEndpoint.get({id: 'data-provider'}).$promise.then(function (result) {
            let cost,
                providers = ['frontlinesms', 'nexmo', 'smssync', 'twilio'];
            _.each(result.providers, function (provider, index) {
                if (provider && _.contains(providers, index)) {
                    // warning, this is a hack until cost is included in the api
                    result[index].cost = 1;
                    cost = result[index].cost;
                    $scope.sms = $scope.targetedSurvey.stepThree.questions.length * $scope.finalNumbers.goodNumbers.length;
                    $scope.cost = $scope.sms * cost;
                }
            });
        });
    }

    function openQuestionModal(question) {
        $scope.stepThreeWarning = false;
        if (question) {
            $scope.editQuestion = question;
            // copying label, question-property is used to avoid the label-text to update while writing in the modal-window
            $scope.editQuestion.question = angular.copy($scope.editQuestion.label);
        } else {
            $scope.editQuestion = {newQuestion: true};
        }

        let modalTitle = question ? 'survey.targeted_survey.edit_title' : 'survey.targeted_survey.new_question_title';

        ModalService.openTemplate('<targeted-question></targeted-question>', modalTitle, null, $scope, true, true);
    }

    function checkForDuplicate() {
        let exists = _.filter($scope.targetedSurvey.stepThree.questions, function (question) {
            return $scope.editQuestion.question === question.label;
        });
        return exists.length !== 0;
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

    function deleteQuestion() {
        ModalService.close();
        if (!$scope.editQuestion.newQuestion) {
            $scope.targetedSurvey.stepThree.questions = _.filter($scope.targetedSurvey.stepThree.questions, function (question) {
                return question.label !== $scope.editQuestion.label;
            });
        }
    }

    function goToDataView(id) {
        // redirecting to data-view, function used in the notification-window
        PostFilters.setFilter('form', [id]);
        $state.go('posts.data');
    }

    function publish() {
        /* WARNING! This is using the FormEndpoint saving a normal survey. This will change in some way once the api is ready.
        * We also need to add the numbers somewhere */

        /* WARNING! If we end up using the same endpoint as for other surveys,
        *  we should consider moving save-survey/tasks/attributes-code to a survey to
        * be able to use same code in both surveys and targeted surveys + we need to add the numbers somewhere*/

        let survey =  {
                color: null,
                everyone_can_create: true,
                name: $scope.name,
                description: $scope.description,
                require_approval: $scope.targetedSurvey.require_review,
                hide_author: $scope.targetedSurvey.hide_responders
            };

        Notify.confirmModal('Are you sure you want to send this SMS survey?', null, getPublishDescription(), `{questions: ${$scope.targetedSurvey.stepThree.questions.length}, numbers: ${$scope.finalNumbers.goodNumbers.length}, sms: ${$scope.sms}, cost:${$scope.cost}}`, 'publish').then(function () {
            FormEndpoint
                .saveCache(survey)
                .$promise
                .then(function (savedSurvey) {
                    let task = {
                        attributes: $scope.targetedSurvey.stepThree.questions,
                        formId: savedSurvey.id,
                        form_id: savedSurvey.id,
                        is_public: true,
                        label: 'Post',
                        priority: 0,
                        required: false,
                        show_when_published: true,
                        task_is_internal_only: false,
                        type: 'post'
                    };
                    FormStageEndpoint
                        .saveCache(task)
                        .$promise
                        .then(function (savedTask) {
                            let questions = [];
                            _.each($scope.targetedSurvey.stepThree.questions, function (question) {
                                    question.form_stage_id = savedTask.id;
                                    question.formId = savedSurvey.id;
                                    questions.push(FormAttributeEndpoint
                                        .saveCache(question)
                                        .$promise);
                                });
                            $q.all(questions).then(function (saved) {
                                let messages = $scope.targetedSurvey.stepThree.questions.length * $scope.finalNumbers.goodNumbers.length;
                                let notifyMessage = messages === 1 ? 'survey.targeted_survey.publish_notification_one' : 'survey.targeted_survey.publish_notification_many';

                                Notify.notifyAction(notifyMessage, {messages}, false, 'thumb-up', 'circle-icon confirmation', {callback: goToDataView, text: 'survey.targeted_survey.notification_button', callbackArg: savedSurvey.id});
                            });
                        });
                });
        });
    }

    function getPublishDescription() {
        if ($scope.isActiveStep(4)) {
            if ($scope.targetedSurvey.stepThree.questions.length === 1 && $scope.finalNumbers.goodNumbers.length === 1) {
                return 'survey.targeted_survey.publish_description_one_number_one_question';
            } else if ($scope.targetedSurvey.stepThree.questions.length === 1) {
                return 'survey.targeted_survey.publish_description_one_question';
            } else if ($scope.finalNumbers.goodNumbers.length === 1) {
                return 'survey.targeted_survey.publish_description_one_number';
            } else {
                return 'survey.targeted_survey.publish_description_many';
            }
        }
    }

    function previousStep() {
        $scope.activeStep = $scope.activeStep - 1;
    }

    function getCountryCodes() {
        CountryCodeEndpoint.query().$promise.then((countryList) => {
            _.each(countryList, (country) => {
                country.country_name = $translate.instant('countries.' + country.country_name);
                $scope.countriesList.push(country);
            });
        });
    }
}];
