var ROOT_PATH = '../../../../';

describe('common password reset controller', function () {

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

        testApp.controller('passwordResetController', require(ROOT_PATH + 'app/common/controllers/password-reset-controller.js'))
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
        $controller('passwordResetController', {
            $scope: $scope,
            PasswordReset: {
                reset: function (email) {
                    return {
                        finally: function (success, fail) {
                            email === 'pass' ? success() : fail();
                        }
                    };
                }
            },
            $filter: function () {
                return function () {};
            }
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should succeed in resetting the password', function () {

        $scope.email = 'pass';
        $scope.registerSubmit();

        expect($scope.processing).toBe(false);
    });

});
