var ROOT_PATH = '../../../../';

describe('common password reset confirm controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('passwordResetConfirmController', require(ROOT_PATH + 'app/common/controllers/password-reset-confirm-controller.js'))
        .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        $rootScope.goBack = function () {};
    }));


    beforeEach(function () {
        $controller('passwordResetConfirmController', {
            $scope: $scope,
            PasswordReset: {
                resetConfirm: function (token, pass) {
                    return {
                        then: function (success, fail) {
                            token === 'pass' ? success() : fail();
                        }
                    };
                }
            },
            $filter: function () {
                return function () {};
            },
            $routeParams: {token: 'aed43kjdd'}
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should succeed in resetting the password', function () {
        spyOn(Notify, 'showSingleAlert');

        $scope.token = 'pass';
        $scope.registerSubmit();

        expect(Notify.showSingleAlert).toHaveBeenCalled();
    });

    it('should fail in resetting the password', function () {
        spyOn(Notify, 'showApiErrors');

        $scope.token = 'fail';
        $scope.registerSubmit();

        expect(Notify.showApiErrors).toHaveBeenCalled();
    });

});
