var ROOT_PATH = '../../../../';

describe('common google2fa directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        UserEndpoint,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('google2fa', require(ROOT_PATH + 'app/common/directives/google2fa'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _UserEndpoint_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $scope.user = {};

        Notify = _Notify_;
        UserEndpoint = _UserEndpoint_;

        element = '<google2fa user="user"></google2fa>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should set the step to guide', function () {
        isolateScope.setStep();
        expect(isolateScope.step).toEqual('guide');
    });

    it('should set the step to the provide value', function () {
        isolateScope.setStep('test');
        expect(isolateScope.step).toEqual('test');
    });

    it('should start 2fa enable mode', function () {
        isolateScope.start2faEnable();

        expect(isolateScope.google2fa_otp).toEqual(undefined);
        expect(isolateScope.step).toEqual('guide');
        expect(isolateScope.showEnableModal).toBe(true);
    });

    it('should cancel the 2fa process', function () {
        isolateScope.cancel();

        expect(isolateScope.showEnableModal).toBe(false);
    });

    it('should fail to enable 2fa', function () {
        spyOn(Notify, 'showApiErrors');
        spyOn(UserEndpoint, 'enable2fa').and.callFake(function () {
            return {
                $promise: {
                    then: function (success, fail) {
                        fail();
                    }
                }
            };
        });
        isolateScope.setup();
        expect(Notify.showApiErrors).toHaveBeenCalled();
        expect(isolateScope.showEnableModal).toBe(false);
        expect(isolateScope.step).toEqual('guide');
    });

    it('should succeed in enabling 2fa', function () {
        spyOn(UserEndpoint, 'enable2fa').and.callFake(function () {
            return {
                $promise: {
                    then: function (success, fail) {
                        success({google2fa_url: 'http://teststuff'});
                    }
                }
            };
        });
        isolateScope.setup();
        expect(isolateScope.step).toEqual('qr_verify');
    });

    it('should disable 2fa', function () {
        spyOn(Notify, 'showNotificationSlider');
        spyOn(UserEndpoint, 'disable2fa').and.callFake(function () {
            return {
                $promise: {
                    then: function (success, fail) {
                        success();
                    }
                }
            };
        });
        isolateScope.user.id = 'pass';

        isolateScope.update2faDisable();
        $rootScope.$digest();

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should set verification state to failed', function () {
        isolateScope.verificationFailed();
        expect(isolateScope.verifyFailed).toBe(true);
    });

    it('should set verification succeeded', function () {
        spyOn(Notify, 'showNotificationSlider');
        isolateScope.user.id = 'pass';
        isolateScope.verificationSucceeded();

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
        expect(isolateScope.verifyFailed).toBe(false);
        expect(isolateScope.step).toEqual('verified');
    });

    it('should fail to update user', function () {
        spyOn(Notify, 'showApiErrors');
        isolateScope.verificationSucceeded();

        expect(Notify.showApiErrors).toHaveBeenCalled();
        expect(isolateScope.showEnableModal).toBe(false);
        expect(isolateScope.step).toEqual('guide');
    });

    it('should fail to verify otp code', function () {
        spyOn(Notify, 'showApiErrors');
        spyOn(UserEndpoint, 'verify2fa').and.callFake(function () {
            return {
                $promise: {
                    then: function (success, fail) {
                        fail();
                    }
                }
            };
        });
        isolateScope.verify();
        expect(Notify.showApiErrors).toHaveBeenCalled();
        expect(isolateScope.showEnableModal).toBe(false);
        expect(isolateScope.step).toEqual('guide');
    });

    it('should verify otp code', function () {
        spyOn(Notify, 'showNotificationSlider');
        spyOn(UserEndpoint, 'verify2fa').and.callFake(function () {
            return {
                $promise: {
                    then: function (success, fail) {
                        success({google2fa_valid: true});
                    }
                }
            };
        });
        isolateScope.user.id = 'pass';
        isolateScope.verify();
        expect(Notify.showNotificationSlider).toHaveBeenCalled();
        expect(isolateScope.verifyFailed).toBe(false);
        expect(isolateScope.step).toEqual('verified');
    });
});
