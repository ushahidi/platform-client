describe('setting create targeted survey controller', function () {

    var $scope,
        Features,
        $controller;

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

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Features_) {
        $scope = _$rootScope_.$new();
        Features = _Features_;
        $controller = _$controller_;
        $controller('targetedSurvey', {
            $scope: $scope
        });
    }));
    describe('controller-functions', function () {
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
                $scope.selectedCountry = { 'name': 'United States', 'dial_code': '+1', 'code': 'US' };
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
                $scope.selectedCountry = { 'name': 'United States', 'dial_code': '+1', 'code': 'US' };
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
                $scope.selectedCountry = { 'name': 'United States', 'dial_code': '+1', 'code': 'US' };
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
                $scope.selectedCountry = { 'name': 'United States', 'dial_code': '+1', 'code': 'US' };
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
                    goodNumbersString: '3172351967, 3176742327,',
                    badNumbersString: '',
                    repeatCount: 0,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 0
                });
            });
            it('should remove duplicate numbers', function () {
                $scope.runValidations('3172351967, 3176742327, 3172351967');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967, 3176742327,',
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
                    goodNumbersString: '3172351967, 3176742327,',
                    badNumbersString: ' 12345,',
                    repeatCount: 1,
                    storageObj: {
                        '3172351967': '3172351967',
                        '3176742327': '3176742327'
                    },
                    badNumberCount: 1
                });
            });
            it('should disregard truly empty elements', function () {
                $scope.runValidations('3172351967, 3176742327, 3172351967, 12345,,');
                expect($scope.finalNumbers).toEqual({
                    goodNumbers: ['3172351967', '3176742327'],
                    goodNumbersString: '3172351967, 3176742327,',
                    badNumbersString: ' 12345,',
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
});
