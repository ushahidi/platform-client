describe('login directive', function () {

    var $rootScope,
        $scope,
        directiveScope,
        $compile,
        mockAuthenticationService;

    beforeEach(function () {
        mockAuthenticationService = {
            loginStatus: false,
            login: function (username, password) {
                return {
                    then: function (successCallback, failureCallback) {
                        password === 'correct' ? successCallback() : failureCallback();
                    }
                };
            },
            getLoginStatus: function () {
                return this.loginStatus;
            }
        };

        makeTestApp()
        .directive('loginForm', require('app/auth/login.directive.js'))
        .service('Authentication', function () {
            return mockAuthenticationService;
        })
        .service('PasswordReset', function () {
            return {
                openReset: function () {}
            };
        })
        .service('ConfigEndpoint', function () {
            return {
                get: function (params) {
                    return {
                        $promise : function (cb) {
                            cb({});
                        }
                    };
                }
            };
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $scope = _$rootScope_.$new();

        $scope.closeModal = function () {};
        spyOn($scope, 'closeModal').and.callThrough();

        spyOn(mockAuthenticationService, 'login').and.callThrough();
    }));

    describe('when logged in', function () {
        beforeEach(angular.mock.inject(function () {
            mockAuthenticationService.loginStatus = true;

            var element = '<login-form></login-form>';
            element = $compile(element)($scope);
            $scope.$digest();
            directiveScope = element.isolateScope();
        }));

        it('should call closeModal', function () {
            expect($scope.closeModal).toHaveBeenCalled();
        });
    });

    describe('when logged out', function () {
        beforeEach(angular.mock.inject(function () {
            spyOn(mockAuthenticationService, 'getLoginStatus').and.callThrough();

            var element = '<login-form></login-form>';
            element = $compile(element)($scope);
            $scope.$digest();
            directiveScope = element.scope();
            directiveScope = element.isolateScope();
        }));

        it('should have initial values', function () {
            expect(directiveScope.failed).toEqual(false);
            expect(directiveScope.processing).toEqual(false);
            expect(directiveScope.email).toEqual('');
            expect(directiveScope.password).toEqual('');
        });

        it('should check login status', function () {
            expect(mockAuthenticationService.getLoginStatus).toHaveBeenCalled();
        });

        it('should login on successfully with correct username/password', function () {
            directiveScope.email = 'testuser';
            directiveScope.password = 'correct';
            directiveScope.loginSubmit('testuser', 'correct');
            expect(mockAuthenticationService.login).toHaveBeenCalledWith('testuser', 'correct');
            expect(directiveScope.failed).toEqual(false);
        });

        it('should clear the form on login failure', function () {
            directiveScope.email = 'testuser';
            directiveScope.password = 'incorrect';
            directiveScope.loginSubmit('testuser', 'incorrect');
            expect(mockAuthenticationService.login).toHaveBeenCalledWith('testuser', 'incorrect');
            expect(directiveScope.failed).toEqual(true);
            expect(directiveScope.processing).toEqual(false);
            expect(directiveScope.email).toEqual('');
            expect(directiveScope.password).toEqual('');
        });

        it('cancel should close modal', function () {
            directiveScope.cancel();
            expect($scope.closeModal).toHaveBeenCalled();
        });
    });

});
