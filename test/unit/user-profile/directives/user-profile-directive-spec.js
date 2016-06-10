var ROOT_PATH = '../../../../';

describe('user profile directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        $compile,
        UserEndpoint,
        Notify,
        element;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ])
        .directive('userProfile', require(ROOT_PATH + 'app/user-profile/directives/user-profile.js'))
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_, _UserEndpoint_, _Notify_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        UserEndpoint = _UserEndpoint_;
        Notify = _Notify_;
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
        describe('with a successfull backend call', function () {
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
