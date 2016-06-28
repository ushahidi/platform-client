var ROOT_PATH = '../../../../';

describe('common password reset confirm controller', function () {

    var $rootScope,
        $scope,
        directiveScope,
        Notify,
        Session,
        $compile,
        mockPasswordReset = {
            resetConfirm: function (token, password) {
                return {
                    then: function (success, fail) {
                        token === 'pass' ? success() : fail();
                    }
                };
            }
        };

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.directive('passwordResetConfirm', require(ROOT_PATH + 'app/common/auth/password-reset-confirm.directive.js'))
        .service('PasswordReset', function () {
            return mockPasswordReset;
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        spyOn(Notify, 'notify');
        spyOn(mockPasswordReset, 'resetConfirm').and.callThrough();

        $scope.token = 'aed43kjdd';

        var element = '<password-reset-confirm></password-reset-confirm>';
        element = $compile(element)($scope);
        $scope.$digest();
        directiveScope = element.scope();
    }));

    it('should succeed in resetting the password', function () {
        directiveScope.token = 'pass';
        directiveScope.password = 'abc123';
        directiveScope.submit();

        expect(mockPasswordReset.resetConfirm).toHaveBeenCalledWith('pass', 'abc123');
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail in resetting the password', function () {
        spyOn(Notify, 'apiErrors');

        directiveScope.token = 'fail';
        directiveScope.password = 'abc123';
        directiveScope.submit();

        expect(mockPasswordReset.resetConfirm).toHaveBeenCalledWith('fail', 'abc123');
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

});
