describe('setting create targeted survey controller', function () {

    var $scope,
        Features,
        $controller,
        ModalService;

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

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Features_, _ModalService_, Sortable) {
        $scope = _$rootScope_.$new();
        Features = _Features_;
        ModalService = _ModalService_;
        $controller = _$controller_;

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
                // $scope.activeStep = 1;
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
                $scope.targetedSurvey = {
                    stepThree: {
                        questions: []
                    }
                };
                $scope.editQuestion =  {question: 'TestQuestion', input: 'textarea', newQuestion: true};
                $scope.addNewQuestion();
                expect($scope.targetedSurvey.stepThree.questions.length).toEqual(1);
            });
            it('should adjust the added question-object', function () {
                $scope.targetedSurvey = {
                    stepThree: {
                        questions: []
                    }
                };
                $scope.editQuestion = {question: 'Test question?', input: 'textarea', newQuestion: true};
                $scope.addNewQuestion();
                let adjustedQuestion = {question: 'Test question?', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                expect($scope.editQuestion).toEqual(adjustedQuestion);
            });
            it('should not add an edited question to the model', function () {
                let existingQuestion = {question: 'Test question?', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                $scope.targetedSurvey = {
                    stepThree: {
                        questions: [existingQuestion]
                    }
                };
                $scope.editQuestion =  {question: 'Edited question', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                $scope.addNewQuestion();
                expect($scope.targetedSurvey.stepThree.questions.length).toEqual(1);
            });
            it('should give a question the correct order based on previous questions', function () {
                let question = {question: 'Test question?', input: 'textarea', order: 3, type: 'text', label: 'Test question?'};
                $scope.targetedSurvey = {
                    stepThree: {
                        questions: [question]
                    }
                };
                $scope.editQuestion =  {question: 'Another question', newQuestion: true};
                $scope.addNewQuestion();
                expect($scope.editQuestion.order).toEqual(4);
                expect($scope.targetedSurvey.stepThree.questions.length).toEqual(2);
            });
        });
    });
});
