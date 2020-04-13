describe('user profile directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        $compile,
        UserEndpoint,
        Notify,
        Session,
        element;

    beforeEach(function () {
        makeTestApp()
        .directive('userProfile', require('app/common/user-profile/user-profile.directive.js'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _UserEndpoint_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        UserEndpoint = _UserEndpoint_;
        Notify = _Notify_;
        Session = _Session_ ;
        $scope = _$rootScope_.$new();
        element = '<user-profile><user-profile>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('UserEndpoint usage', function () {
        it('should set the user response', function () {
            isolateScope.user.$promise
                .then(function (response) {
                    expect(response).toEqual({name: 'test user', id: 1});
                });
        });
    });

    describe('saveUser', function () {
        describe('with a successful backend call', function () {
            beforeEach(function () {
                spyOn(UserEndpoint, 'update').and.callThrough();
            });

            describe('after changed values of user', function () {
                beforeEach(function () {
                    isolateScope.user.realname = 'Changed name';
                });

                describe('after calling saveUser', function () {
                    beforeEach(function () {
                        isolateScope.saveUser(isolateScope.user);
                    });

                    it('should call "update" on the UserEndpoint with id=me and the changed user profile values', function () {
                        expect(UserEndpoint.update).toHaveBeenCalled();
                        expect(isolateScope.user.realname).toBe('Changed name');
                    });

                    it('should set user to the new data', function () {
                        expect(isolateScope.user.someField).toBe('addedByServer');
                    });
                });
            });
        });

        describe('with an error on the backend call', function () {

            var errorResponse = {
                    status: 400,
                    data: {
                        'errors': [
                            {
                                'message': 'invalid email address'
                            }
                        ]
                    }
                };

            beforeEach(function () {
                spyOn(Notify, 'apiErrors').and.callThrough();
            });

            describe('change values of user', function () {
                beforeEach(function () {
                    isolateScope.user.email = 'Bad email';
                });

                describe('after calling the method', function () {
                    beforeEach(function () {
                        isolateScope.saveUser(isolateScope.user);
                    });

                    it('should call Notify.apiErrors with the server response', function () {
                        expect(Notify.apiErrors).toHaveBeenCalled();
                        var alertMessages = Notify.apiErrors.calls.mostRecent().args[0];
                        expect(alertMessages).toEqual(errorResponse);
                    });
                });
            });
        });
    });
});
