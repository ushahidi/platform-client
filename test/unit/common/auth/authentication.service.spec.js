var rootPath = '../../../../';

describe('Authentication', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        Authentication,
        loginPromiseSuccessCallback,
        mockedSessionData,
        mockedOauthTokenResponse,
        mockedUserDataResponse;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'ushahidi.mock',
            'ngResource',
            'angular-cache'
        ]);

        mockedSessionData = {};
        testApp.service('Session', function () {
            return {
                clearSessionData: function () {
                    mockedSessionData = {};
                },
                setSessionDataEntries: function (entries) {
                    mockedSessionData = angular.extend({}, mockedSessionData, entries);
                },
                getSessionDataEntry: function (key) {
                    return mockedSessionData[key];
                },
                setSessionDataEntry: function (key, value) {
                    mockedSessionData[key] = value;
                }
            };
        })
        .service('Authentication', require(rootPath + 'app/common/auth/authentication.service.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');

    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _CONST_, _Authentication_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        Authentication = _Authentication_;
    }));

    describe('beeing still logged out', function () {
        describe('getLoginStatus', function () {
            it('should return false', function () {
                expect(Authentication.getLoginStatus()).toBe(false);
            });
        });
    });

    describe('login', function () {

        describe('with successful post call to "/oauth/token"', function () {

            beforeEach(function () {
                mockedOauthTokenResponse = {
                    'access_token': 'foobarfoobarfoobarfoobarfoobarfoobar',
                    'token_type': 'Bearer',
                    'expires': 9999999999,
                    'expires_in': 3600,
                    'refresh_token': 'foobarfoobarfoobarfoobarfoobarfoobar',
                    'refresh_token_expires_in': 604800
                };
                $httpBackend.whenPOST(BACKEND_URL + '/oauth/token').respond(mockedOauthTokenResponse);
            });

            describe('with successfull get call to "/users/me"', function () {

                beforeEach(function () {
                    mockedUserDataResponse = {
                        'id': 2,
                        'url': 'http://ushahidi-backend/api/v2/users/2',
                        'email': 'admin@example.com',
                        'realname': 'Admin Joe',
                        'role': 'role'
                    };
                    $httpBackend.whenGET(BACKEND_URL + '/api/v2/users/me').respond(mockedUserDataResponse);
                });

                beforeEach(function () {
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    loginPromiseSuccessCallback = jasmine.createSpy('success');

                    Authentication.login('fooUser', 'barPassword').then(loginPromiseSuccessCallback);

                    $httpBackend.flush();
                });

                it('should add the accessToken to the Session', function () {
                    expect(mockedSessionData.accessToken).toEqual(mockedOauthTokenResponse.access_token);
                });

                it('should add the userData to the Session', function () {
                    expect(mockedSessionData.userId).toEqual(mockedUserDataResponse.id);
                    expect(mockedSessionData.realname).toEqual(mockedUserDataResponse.realname);
                    expect(mockedSessionData.email).toEqual(mockedUserDataResponse.email);
                });

                it('should set loginState to true', function () {
                    expect(Authentication.getLoginStatus()).toBe(true);
                });

                it('should broadcast the "login:succeed" event on the rootScope', function () {
                    expect($rootScope.$broadcast).toHaveBeenCalled();
                    var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                    expect(broadcastArguments[0]).toEqual('event:authentication:login:succeeded');
                });

                it('should resolve the returned promise', function () {
                    expect(loginPromiseSuccessCallback).toHaveBeenCalled();
                });

            });
            describe('with unsuccessfull get call to "/users/me"', function () {

                var loginPromiseFailureCallback;

                beforeEach(function () {
                    $httpBackend.whenGET(BACKEND_URL + '/api/v2/users/me').respond(404, '');
                });

                beforeEach(function () {
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    loginPromiseSuccessCallback = jasmine.createSpy('success');
                    loginPromiseFailureCallback = jasmine.createSpy('failure');

                    Authentication.login('fooUser', 'barPassword').then(loginPromiseSuccessCallback, loginPromiseFailureCallback);

                    $httpBackend.flush();
                });

                it('should clear the Session data', function () {
                    expect(mockedSessionData).toEqual({});
                });

                it('should set loginState to false', function () {
                    expect(Authentication.getLoginStatus()).toBe(false);
                });

                it('should broadcast the "login:failed" event on the rootScope', function () {
                    expect($rootScope.$broadcast).toHaveBeenCalled();
                    var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                    expect(broadcastArguments[0]).toEqual('event:authentication:login:failed');
                });

                it('should reject the returned promise', function () {
                    expect(loginPromiseSuccessCallback).not.toHaveBeenCalled();
                    expect(loginPromiseFailureCallback).toHaveBeenCalled();
                });

            });
        });

        describe('with unsuccessfull post call to "/oauth/token"', function () {

            var loginPromiseFailureCallback;

            beforeEach(function () {
                $httpBackend.whenPOST(BACKEND_URL + '/oauth/token').respond(401, '');
            });

            beforeEach(function () {
                spyOn($rootScope, '$broadcast').and.callThrough();

                loginPromiseSuccessCallback = jasmine.createSpy('success');
                loginPromiseFailureCallback = jasmine.createSpy('failure');

                Authentication.login('fooUser', 'barPassword').then(loginPromiseSuccessCallback, loginPromiseFailureCallback);

                $httpBackend.flush();
            });

            it('should clear the Session data', function () {
                expect(mockedSessionData).toEqual({});
            });

            it('should set loginState to false', function () {
                expect(Authentication.getLoginStatus()).toBe(false);
            });

            it('should broadcast the "login:failed" event on the rootScope', function () {
                expect($rootScope.$broadcast).toHaveBeenCalled();
                var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                expect(broadcastArguments[0]).toEqual('event:authentication:login:failed');
            });

            it('should reject the returned promise', function () {
                expect(loginPromiseSuccessCallback).not.toHaveBeenCalled();
                expect(loginPromiseFailureCallback).toHaveBeenCalled();
            });

        });

    });

    describe('logout', function () {

        beforeEach(function () {
            mockedSessionData = {
                userId: 2,
                realname: 'Max Doe',
                email: 'max@doe.org',
                role: 'role',
                accessToken: 'fooBarAccessToken'
            };

            spyOn($rootScope, '$broadcast').and.callThrough();

            Authentication.logout();
        });

        it('should broadcast the "logout:succeeded" event on the rootScope', function () {
            expect($rootScope.$broadcast).toHaveBeenCalled();
            var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
            expect(broadcastArguments[0]).toEqual('event:authentication:logout:succeeded');
        });

        it('should set loginState to false', function () {
            expect(Authentication.getLoginStatus()).toBe(false);
        });

        it('should clear the Session data', function () {
            expect(mockedSessionData).toEqual({});
        });

    });
});
