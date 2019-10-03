describe('Authentication', function () {

    var $rootScope,
        $httpBackend,
        $injector,
        BACKEND_URL,
        Authentication,
        loginPromiseSuccessCallback,
        mockedSessionData,
        mockedOauthTokenResponse,
        mockedUserDataResponse,
        mockedEmbedService;

    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.requires.push('ngResource', 'angular-cache');

        mockedSessionData = {};
        mockedEmbedService = {
            isEmbed: function () {}
        };
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
        .service('TermsOfService', () => {
            return {

            };
        })
        .service('Authentication', require('app/common/auth/authentication.service.js'))
        .service('Embed',
            function () {
                return mockedEmbedService;
            }
        );


        angular.mock.module('testApp');

        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    beforeEach(angular.mock.inject(function (_$httpBackend_, _$rootScope_, _CONST_, _$injector_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        $injector = _$injector_;
    }));

    describe('initial login status', function () {
        it('should be logged in if we have a valid auth token', function () {
            mockedSessionData.accessToken = 123;
            mockedSessionData.grantType = 'password';
            mockedSessionData.userId = 10;
            mockedSessionData.accessTokenExpires = Math.floor(Date.now() / 1000) + 3600;
            Authentication = $injector.get('Authentication');

            expect(Authentication.getLoginStatus()).toBe(true);
        });

        it('should be logged out if the auth token is expired', function () {
            mockedSessionData.accessToken = 123;
            mockedSessionData.grantType = 'password';
            mockedSessionData.accessTokenExpires = Math.floor(Date.now() / 1000) - 3600;
            mockedSessionData.userId = 10;
            Authentication = $injector.get('Authentication');

            expect(Authentication.getLoginStatus()).toBe(false);
            expect(mockedSessionData.userId).toBe(undefined);
        });

        it('should be logged out if the auth token is client creds', function () {
            mockedSessionData.accessToken = 123;
            mockedSessionData.grantType = 'client';
            Authentication = $injector.get('Authentication');

            expect(Authentication.getLoginStatus()).toBe(false);
        });
    });

    describe('login', function () {

        beforeEach(angular.mock.inject(function (_Authentication_) {
            Authentication = _Authentication_;
        }));

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
                    expect(mockedSessionData.accessTokenExpires).toEqual(Math.floor(Date.now() / 1000) + mockedOauthTokenResponse.expires_in);
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

        beforeEach(angular.mock.inject(function (_Authentication_) {
            Authentication = _Authentication_;

            mockedSessionData = {
                userId: 2,
                realname: 'Max Doe',
                email: 'max@doe.org',
                role: 'role',
                accessToken: 'fooBarAccessToken',
                grantType: 'password'
            };
            $rootScope.hasPermission = function () {};

            spyOn($rootScope, '$broadcast').and.callThrough();

            Authentication.logout();
        }));

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
