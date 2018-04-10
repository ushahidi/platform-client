describe('setting create targeted survey controller', function () {

    var $scope,
        $controller,
        ModalService,
        CountryCodeEndpoint,
        Notify,
        FormEndpoint,
        FormStatsEndpoint,
        FormContactEndpoint;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.controller('targetedSurvey', require('app/settings/surveys/targeted-surveys/targeted-edit.controller.js'));

        testApp.service('$state', function () {
            return {
                'go': function () {
                    return {};
                }
            };
        });
        testApp.service('$transition$', function () {
            return {
                params: function () {
                    return { id: null };
                }
            };
        });
        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _ModalService_, Sortable, _CountryCodeEndpoint_, _FormStatsEndpoint_, _Notify_, _FormEndpoint_, _FormContactEndpoint_) {
        $scope = _$rootScope_.$new();
        ModalService = _ModalService_;
        $controller = _$controller_;
        Notify = _Notify_;
        CountryCodeEndpoint = _CountryCodeEndpoint_;
        FormStatsEndpoint = _FormStatsEndpoint_;
        FormEndpoint = _FormEndpoint_;
        FormContactEndpoint = _FormContactEndpoint_;
        spyOn(CountryCodeEndpoint, 'query').and.callThrough();
        spyOn(FormStatsEndpoint, 'query').and.callThrough();
        spyOn(FormContactEndpoint, 'query').and.callThrough();
        $controller('targetedSurvey', {
            $scope: $scope
        });
    }));
    describe('controller-functions', function () {
        describe('isActiveStep', function () {
            it('should return true if step is active', function () {
                expect($scope.isActiveStep(1)).toEqual(true);
                $scope.activeStep = 2;
                expect($scope.isActiveStep(2)).toEqual(true);
            });
            it('should return false step isnt active', function () {
                $scope.activeStep = 1;
                expect($scope.isActiveStep(2)).toEqual(false);
                $scope.activeStep = 2;
                expect($scope.isActiveStep(1)).toEqual(false);
            });
        });
        describe('isValidStep', function () {
            it('should return false if step is not complete', function () {
                let stepOne = {
                    $valid: true
                };
                let stepTwo = {
                    $valid: false
                };
                expect($scope.isStepComplete(stepOne)).toEqual(true);
                expect($scope.isStepComplete(stepTwo)).toEqual(false);
            });
        });
        describe('Step Three Completion', function () {
            it('should complete step three when there are questions', function () {
                $scope.survey = {
                    attributes: ['question 1']
                };
                $scope.completeStepThree();
                expect($scope.activeStep).toEqual(4);
                expect($scope.stepThreeWarning).toEqual(false);
            });
            it('should fail to complete the step when there are no questions', function () {
                $scope.survey = {
                    attributes: []
                };
                $scope.activeStep = 3;
                $scope.completeStepThree();
                expect($scope.activeStep).toEqual(3);
                expect($scope.stepThreeWarning).toEqual(true);
            });
            it('should fail to complete the step when no questions is added', function () {
                $scope.survey = {};
                $scope.activeStep = 3;
                $scope.completeStepThree();
                expect($scope.activeStep).toEqual(3);
                expect($scope.stepThreeWarning).toEqual(true);
            });
        });
        describe('openQuestionModal', function () {
            it('should open the targeted-question-modal', function () {
                spyOn(ModalService, 'openTemplate').and.callThrough();
                $scope.openQuestionModal();
                expect(ModalService.openTemplate).toHaveBeenCalled();
            });
            it('should set a new editQuestion if no one is sent to the function', function () {
                $scope.openQuestionModal();
                expect($scope.editQuestion).toEqual({newQuestion: true});
            });
            it('should use the question sent to the function as editQuestion', function () {
                let question = {label: 'Test question?', input: 'textarea'};
                $scope.openQuestionModal(question);
                expect($scope.editQuestion).toEqual(question);
            });
        });
        describe('addNewQuestion', function () {
            it('should add a new question to the model', function () {
                $scope.survey = {
                    attributes: []
                };
                $scope.editQuestion =  {question: 'TestQuestion', input: 'textarea', newQuestion: true};
                $scope.addNewQuestion();
                expect($scope.survey.attributes.length).toEqual(1);
            });
            it('should adjust the added question-object', function () {
                $scope.survey = {
                    attributes: []
                };
                $scope.editQuestion = {question: 'Test question?', input: 'textarea', newQuestion: true};
                $scope.addNewQuestion();
                let adjustedQuestion = {question: 'Test question?', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                expect($scope.editQuestion).toEqual(adjustedQuestion);
            });
            it('should not add an edited question to the model', function () {
                let existingQuestion = {question: 'Test question?', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                $scope.survey = {
                    attributes: [existingQuestion]
                };
                $scope.editQuestion =  {question: 'Edited question', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                $scope.addNewQuestion();
                expect($scope.survey.attributes.length).toEqual(1);
            });
            it('should give a question the correct order based on previous questions', function () {
                let question = {question: 'Test question?', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                $scope.survey = {
                    attributes: [question]
                };
                $scope.editQuestion =  {question: 'Another question', newQuestion: true};
                $scope.addNewQuestion();
                expect($scope.editQuestion.order).toEqual(4);
                expect($scope.survey.attributes.length).toEqual(2);
            });
        });
        describe('Step One', function () {
            it('should move to step 2 when step one is complete', function () {
                $scope.targetedSurvey = {
                    stepOne: {
                        $valid: true
                    }
                };
                $scope.completeStepOne();
                expect($scope.activeStep).toEqual(2);
                expect($scope.stepOneWarning).toEqual(false);
            });
            it('should stay at step 1 and turn on warning when failing', function () {
                $scope.activeStep = 1;
                $scope.targetedSurvey = {
                    stepOne: {
                        $valid: false
                    }
                };
                $scope.completeStepOne();
                expect($scope.activeStep).toEqual(1);
                expect($scope.stepOneWarning).toEqual(true);
            });
        });
        describe('Step Two', function () {
            it('should move to step 3 when step 2 is complete', function () {
                $scope.targetedSurvey = {
                    stepTwo: {
                        $valid: true
                    }
                };
                $scope.selectedCountry = { 'country_name': 'United States', 'dial_code': '+1', 'country_code': 'US' };
                $scope.textBoxNumbers = '3172351967, 3176742327';
                $scope.completeStepTwo();
                expect($scope.activeStep).toEqual(3);
                expect($scope.stepTwoWarning).toEqual(false);
            });
            it('should stay at step 2 when validation fails', function () {
                $scope.activeStep = 2;
                $scope.targetedSurvey = {
                    stepTwo: {
                        $valid: true
                    }
                };
                $scope.selectedCountry = { 'country_name': 'United States', 'dial_code': '+1', 'country_code': 'US' };
                $scope.textBoxNumbers = '3172351967, 3176742327, 123';
                $scope.completeStepTwo();
                expect($scope.activeStep).toEqual(2);
                expect($scope.stepTwoWarning).toEqual(false);
            });
            it('should turn on the warning when fields are incomplete', function () {
                $scope.activeStep = 2;
                $scope.targetedSurvey = {
                    stepTwo: {
                        $valid: false
                    }
                };
                $scope.selectedCountry = { 'country_name': 'United States', 'dial_code': '+1', 'country_code': 'US' };
                $scope.textBoxNumbers = '3172351967, 3176742327, 123';
                $scope.completeStepTwo();
                expect($scope.activeStep).toEqual(2);
                expect($scope.stepTwoWarning).toEqual(true);
            });
            it('should reset the phone number object, which enables user to add to/edit numbers', function () {
                $scope.finalNumbers = {
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967, 3176742327,',
                    badNumbersString: '12345',
                    repeatCount: 1,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 0
                };
                $scope.resetNumbers();
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: [],
                    goodNumbersString: '',
                    badNumbersString: '',
                    repeatCount: 0,
                    storageObj: {},
                    badNumberCount: 0
                });
            });
        });
        describe('Step Two Phone Number Validations', function () {
            beforeEach(function () {
                $scope.selectedCountry = { 'country_name': 'United States', 'dial_code': '+1', 'country_code': 'US' };
                $scope.finalNumbers = {
                    goodNumbers: [],
                    goodNumbersString: '',
                    badNumbersString: '',
                    repeatCount: 0,
                    storageObj: {},
                    badNumberCount: 0
                };
            });
            it('should validate phone numbers as GOOD numbers', function () {
                $scope.runValidations('3172351967, 3176742327');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967,3176742327,',
                    badNumbersString: '',
                    repeatCount: 0,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 0
                });
            });
            it('should validate phone numbers with special characters as GOOD numbers', function () {
                $scope.runValidations('317-235-1967, 317.674.2327');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['317-235-1967', '317.674.2327'],
                    goodNumbersString: '317-235-1967,317.674.2327,',
                    badNumbersString: '',
                    repeatCount: 0,
                    storageObj: {
                        '317-235-1967': '317-235-1967',
                        '317.674.2327': '317.674.2327'
                    },
                    badNumberCount: 0
                });
            });
            it('should remove duplicate numbers', function () {
                $scope.runValidations('3172351967, 3176742327, 3172351967');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967,3176742327,',
                    badNumbersString: '',
                    repeatCount: 1,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 0
                });
            });
            it('should separate good and bad numbers', function () {
                $scope.runValidations('3172351967, 3176742327, 3172351967, 12345');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967,3176742327,',
                    badNumbersString: '12345,',
                    repeatCount: 1,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 1
                });
            });
            it('should disregard empty elements', function () {
                $scope.runValidations('3172351967, 3176742327, 3172351967, 12345,, ');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967,3176742327,',
                    badNumbersString: '12345,',
                    repeatCount: 1,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 1
                });
            });
        });
    });
    describe('publish', function () {
        it('should ask the user if they want to sent the survey', function () {
            $scope.survey = {
                attributes: []
            };
            spyOn(Notify, 'confirmModal').and.callThrough();
            $scope.publish();
            expect(Notify.confirmModal).toHaveBeenCalled();
        });
        it('should save the targeted-survey-form', function () {
            $scope.survey =  {
                    color: null,
                    everyone_can_create: false,
                    hide_author: true,
                    targeted_survey: 1,
                    attributes: [{id: 1}],
                    id: 'pass'
                };
            spyOn(FormEndpoint, 'saveCache').and.callThrough();
            $scope.publish();
            expect(FormEndpoint.saveCache).toHaveBeenCalled();
        });
    });
    describe('getCountryCodes', function () {
        it('should call country-code-endpoint on pageload', function () {
            $scope.getCountryCodes();
            expect(CountryCodeEndpoint.query).toHaveBeenCalled();
        });
        it('should populate countriesList with countries', function () {
            expect($scope.countriesList.length).toEqual(1);
        });
    });
    describe('survey (form) stats', function () {
        it('should save the form stats to $scope', function () {
            $scope.getFormStats();
            $scope.$apply();
            expect(FormStatsEndpoint.query).toHaveBeenCalled();
            expect($scope.totalResponses).toEqual(9);
            expect($scope.totalRecipients).toEqual(5);
        });
        it('should add the form-contacts to $scope', function () {
            $scope.getFormStats();
            $scope.$apply();
            expect(FormContactEndpoint.query).toHaveBeenCalled();
            expect($scope.recipientCount).toEqual(1);
        });
    });
});
