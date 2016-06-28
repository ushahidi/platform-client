var ROOT_PATH = '../../../../';

describe('common password reset controller', function () {

    var $rootScope,
        $scope,
        directiveScope,
        Notify,
        Session,
        $compile,
        mockPasswordReset = {
            reset: function (email) {
                return {
                    finally: function (success, fail) {
                        email === 'pass' ? success() : fail();
                    }
                };
            },
            openResetConfirm: function () {}
        };

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.directive('passwordReset', require(ROOT_PATH + 'app/common/auth/password-reset.directive.js'))
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

        var element = '<password-reset></password-reset>';
        element = $compile(element)($scope);
        $scope.$digest();
        directiveScope = element.scope();
    }));

    it('should succeed in resetting the password', function () {
        spyOn(mockPasswordReset, 'reset').and.callThrough();
        spyOn(mockPasswordReset, 'openResetConfirm').and.callThrough();

        directiveScope.email = 'pass';
        directiveScope.submit();

        expect(directiveScope.processing).toBe(false);
        expect(mockPasswordReset.reset).toHaveBeenCalled();
        expect(mockPasswordReset.openResetConfirm).toHaveBeenCalled();
    });

});
