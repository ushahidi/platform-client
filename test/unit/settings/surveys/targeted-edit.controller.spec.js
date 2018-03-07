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
            //defaulting to true right now
            expect($scope.isStepComplete(2)).toEqual(true);
        });
    });
});
