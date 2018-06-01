import { isValidNumber, formatNumber, parse } from 'libphonenumber-js';
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
    'FormStatsEndpoint',
    '$q',
    'PostFilters',
    'LoadingProgress',
    '$transition$',
    'CountryCodeEndpoint',
    '$translate',
    'FormContactEndpoint',
    'SurveyNotify',
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
    FormStatsEndpoint,
    $q,
    PostFilters,
    LoadingProgress,
    $transition$,
    CountryCodeEndpoint,
    $translate,
    FormContactEndpoint,
    SurveyNotify
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
    $scope.cancel = cancel;
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
    $scope.goToDataView = goToDataView;
    $scope.getCountryCodes = getCountryCodes;
    $scope.countriesList = [];
    $scope.getFormStats = getFormStats;
    $scope.totalResponses = 0;
    $scope.totalRecipients = 0;
    $scope.totalSent = 0;
    $scope.totalPending = 0;
    $scope.default_attributes = [
        {
            cardinality: 0,
            input: 'text',
            label: 'Title',
            priority: 1,
            required: true,
            type: 'title',
            options: [],
            config: {},
            form_stage_id: null
        },
        {
            cardinality: 0,
            input: 'text',
            label: 'Description',
            priority: 2,
            required: true,
            type: 'description',
            options: [],
            config: {},
            form_stage_id: null
        }
    ];

    Features.loadFeatures()
           .then(() => {
            $scope.targetedSurveysEnabled = Features.isFeatureEnabled('targeted-surveys');
            // reroute if feature-flag is not turned on
            if (!$scope.targetedSurveysEnabled) {
                $state.go('settings.surveys.create');
            }
        });
    $scope.getCountryCodes();

    $scope.surveyId = $transition$.params().id;
    if ($scope.surveyId) {
        //if we come here from the survey-list, we show the summary of the survey
        // WARNING: TODO: Once we can get hold of the stats about responses and number of sms sent, we need to request them
        $scope.activeStep = 4;
        FormEndpoint.get({id: $scope.surveyId}).$promise.then((result) => {
            $scope.survey = result;
            FormAttributeEndpoint.query({formId: $scope.surveyId}).$promise.then((result) => {
                $scope.survey.attributes = result;
            });
        });
        getFormStats();
    } else {
        // Initializes a new survey-object
        $scope.survey =  {
                color: null,
                everyone_can_create: false,
                hide_author: true,
                targeted_survey: 1
            };
    }

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
            _.each($scope.survey.attributes, function (question) {
                if (question.label === item.getAttribute('data')) {
                    question.priority = index + 1;
                }
            });
        });
    }

    function completeStepOne() {
        if (isStepComplete($scope.targetedSurvey.stepOne)) {
            $scope.activeStep = 2;
            $scope.stepOneWarning = false;
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
                // parse() isn't as complete as isValidNumber(), but formatNumber() needs parsed data
                //  so with this lib, we have to do _all_ of these things to get to E164
                let parsedResult = parse(number, $scope.selectedCountry.country_code);
                number = formatNumber(parsedResult, 'E.164');
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
        if ($scope.survey.attributes !== undefined && $scope.survey.attributes.length) {
            $scope.stepThreeWarning = false;
            $scope.activeStep = 4;
            $scope.total_sms_messages = $scope.survey.attributes.length * $scope.finalNumbers.goodNumbers.length;
        } else {
            $scope.stepThreeWarning = true;
        }
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
        let exists = _.filter($scope.survey.attributes, function (question) {
            return $scope.editQuestion.question === question.label;
        });
        return exists.length !== 0;
    }

    function addNewQuestion() {
        ModalService.close();
        if (!$scope.survey.attributes) {
            $scope.survey.attributes = [];
        }

        $scope.editQuestion.input = 'textarea';
        $scope.editQuestion.type = 'text';

        // This is to avoid the 2-way binding and the label to update while writing in the modal
        $scope.editQuestion.label = angular.copy($scope.editQuestion.question);

        // This is to avoid adding same question twice and we don't have any unique id-s for the questions yet
        if ($scope.editQuestion.newQuestion) {
            $scope.editQuestion.priority = getPriority($scope.survey.attributes);
            delete $scope.editQuestion.newQuestion;
            $scope.survey.attributes.push($scope.editQuestion);
        }
    }

    function getPriority(step) {
        return step && step.length > 0 ? _.last(step).priority + 1 : 1;
    }

    function deleteQuestion() {
        ModalService.close();
        if (!$scope.editQuestion.newQuestion) {
            $scope.survey.attributes = _.filter($scope.survey.attributes, function (question) {
                return question.label !== $scope.editQuestion.label;
            });
        }
    }
    function cancel() {
        ModalService.close();
    }
    function goToDataView(id) {
        // redirecting to data-view, function used in the notification-window and in the summary-view
        PostFilters.setFilter('form', [id]);
        $state.go('posts.data');
    }

    function saveContacts(id) {
        FormContactEndpoint.save({formId: id, contacts: $scope.textBoxNumbers, country_code: $scope.selectedCountry.country_code}).$promise.then(function (response) {
            let messages = $scope.finalNumbers.goodNumbers.length * $scope.survey.attributes.length;
            let notifyMessage = messages === 1 ? 'survey.targeted_survey.publish_notification_one' : 'survey.targeted_survey.publish_notification_many';
            Notify.notifyAction(notifyMessage, {messages}, false, 'thumb-up', 'circle-icon confirmation', {callback: goToDataView, text: 'survey.targeted_survey.notification_button', callbackArg: id, actionClass: 'button button-alpha'});
            $state.go('settings.surveys', {}, { reload: true });
        }, function (err) {
            let errors = ['survey.targeted_survey.error_contacts '];
            _.each(err.data.errors, (error) => {
                // if the number-validation fails in the api, we show the user which numbers failed.
                if (error.source) {
                    errors.push(error.source.pointer + ' ');
                }
                Notify.errors(errors);
            });
        });
    }


    function saveFormStageAttributes(id) {

        var attributes = $scope.default_attributes.concat($scope.survey.attributes);
        let task = {
            attributes: attributes,
            formId: id,
            is_public: true,
            label: 'Post',
            priority: 0,
            required: false,
            show_when_published: true,
            task_is_internal_only: false,
            type: 'post',
            // attaching id to survey in case something goes wrong further down in the save-chain, then we dont want to save the survey again, just update it
            id: $scope.survey.stageId
        };

        FormStageEndpoint
            .saveCache(task)
            .$promise
            .then(function (savedTask) {
                $scope.survey.stageId = savedTask.id;
                let questions = [];
                _.each(attributes, function (question) {
                        question.form_stage_id = savedTask.id;
                        question.formId = id;
                        questions.push(FormAttributeEndpoint
                            .saveCache(question)
                            .$promise);
                    });
                $q.all(questions).then(function (saved) {
                    // saving the attributes with id to survey
                    $scope.survey.attributes = saved;
                    // once we have saved the survey and its attributes (the questions) we save the contacts
                    saveContacts(id);
                }, function (err) {
                        Notify.error('survey.targeted_survey.error_message');
                    });
            }, function (err) {
            Notify.error('survey.targeted_survey.error_message');
        });
    }

    function saveTargetedSurvey() {
        FormEndpoint.saveCache($scope.survey)
        .$promise
        .then(function (savedSurvey) {
            // attaching id to survey in case something goes wrong further down, then we dont want to save the survey again, just update it
            $scope.survey.id = savedSurvey.id;
            saveFormStageAttributes(savedSurvey.id);
        }, function (err) {
            Notify.error('survey.targeted_survey.error_message');
        });
    }

    function publish() {
        Notify.confirmModal('Are you sure you want to send this SMS survey?', null, getPublishDescription(), `{questions: ${$scope.survey.attributes.length}, numbers: ${$scope.finalNumbers.goodNumbers.length}, total_sms_messages: ${$scope.total_sms_messages}}`, 'publish').then(function () {
            saveTargetedSurvey();
        });
    }

    function getPublishDescription() {
        if ($scope.isActiveStep(4) && !$scope.surveyId) {
            if ($scope.survey.attributes.length === 1 && $scope.finalNumbers.goodNumbers.length === 1) {
                return 'survey.targeted_survey.publish_description_one_number_one_question';
            } else if ($scope.survey.attributes.length === 1) {
                return 'survey.targeted_survey.publish_description_one_question';
            } else if ($scope.finalNumbers.goodNumbers.length === 1) {
                return 'survey.targeted_survey.publish_description_one_number';
            } else {
                return 'survey.targeted_survey.publish_description_many';
            }
        }
        return 'survey.targeted_survey.published_people';
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

    function getFormStats() {
        let recipientRequest = FormContactEndpoint.query({formId: $scope.surveyId}).$promise;
        let responsesRequest = FormStatsEndpoint.query({formId: $scope.surveyId}).$promise;
        $q.all([recipientRequest, responsesRequest]).then((results) => {
            $scope.recipientCount = results[0].length;
            $scope.totalResponses = results[1].total_responses;
            $scope.totalRecipients = results[1].total_recipients;
            $scope.totalSent = results[1].total_messages_sent;
            $scope.totalPending = results[1].total_messages_pending;
        });
    }
}];
