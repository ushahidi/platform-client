var ROOT_PATH = '../../../../';

describe('login controller', function () {

    var $rootScope,
        $scope,
        $controller,
        $location,
        mockAuthenticationService;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        // .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('loginController', require(ROOT_PATH + 'app/common/controllers/login-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _$location_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $location = _$location_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        var errorResponse = {
            data: {
                error: 'error'
            }
        };
        mockAuthenticationService = {
            login: function (username, password) {
                return {
                    then: function (successCallback, failureCallback) {
                        password === 'correct' ? successCallback() : failureCallback(errorResponse);
                    }
                };
            }
        };

        $controller('loginController', {
            $rootScope: $rootScope,
            $scope: $scope,
            $location: $location,
            Authentication: mockAuthenticationService
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    describe('login', function () {
        describe('with correct username/password', function () {
            beforeEach(function () {
                $scope.email = 'testuser';
                $scope.password = 'correct';
            });

            it('should login on success', function () {
                $scope.loginSubmit();
                expect($scope.failed).toEqual(false);
            });

            it('should clear the form on login failure', function () {
                $scope.password = 'incorrect';
                $scope.loginSubmit();
                expect($scope.failed).toEqual(true);
            });

        });
    });

});
