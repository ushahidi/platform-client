var rootPath = '../../../../';

describe('authentication interceptor', function () {

    var $httpBackend,
        $rootScope,
        $httpProviderIt,
        $http,
        CONST,
        mockedSessionData,
        mockAuthentication;

    beforeEach(function () {
        var testApp = angular.module('testApp', [], function ($httpProvider) {
            $httpProviderIt = $httpProvider;
        });

        mockedSessionData = {
            accessToken: null
        };
        mockAuthentication = {
            loginStatus : false,
            getLoginStatus : function () {
                return this.loginStatus;
            }
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
        .service('Authentication', function () {
            return mockAuthentication;
        })
        .config(require(rootPath + 'app/common/auth/authentication-interceptor.config.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$httpBackend_, _$http_, _$rootScope_, _CONST_) {
        $httpBackend = _$httpBackend_;
        $http = _$http_;
        $rootScope = _$rootScope_;
        CONST = _CONST_;
    }));

    describe('$httpProvider', function () {
        it('should have the authInterceptor', function () {
            expect($httpProviderIt.interceptors).toContain('authInterceptor');
        });
    });

    describe('request handler', function () {

        describe('for API requests', function () {

            describe('with an accessToken stored in the Session service', function () {
                beforeEach(function () {
                    mockedSessionData.accessToken = 'fooBarToken';
                });

                it('should add the authorization token header', function () {

                    $httpBackend.expectGET(CONST.API_URL + '/test-endpoint',
                        {'Accept': 'application/json, text/plain, */*', 'Authorization': 'Bearer fooBarToken'}
                    ).respond(200);

                    $http.get(CONST.API_URL + '/test-endpoint');

                    $httpBackend.flush();
                });
            });

            describe('without an accessToken stored in the Session service', function () {
                var claimedScopes, payload;
                beforeEach(function () {
                    mockedSessionData.accessToken = null;
                    claimedScopes = [
                    'posts',
                    'media',
                    'forms',
                    'api',
                    'tags',
                    'sets',
                    'users',
                    'stats',
                    'layers',
                    'config',
                    'messages'
                    ],
                    payload = {
                        grant_type: 'client_credentials',
                        client_id: CONST.OAUTH_CLIENT_ID,
                        client_secret: CONST.OAUTH_CLIENT_SECRET,
                        scope: claimedScopes.join(' ')
                    };
                });

                it('should ask the backend for an anonymous access_token' +
                    'via client_credentials flow and then' +
                    'add the authorization token header', function () {

                        $httpBackend.expectPOST(CONST.BACKEND_URL + '/oauth/token',
                            payload
                    ).respond(200, {
                        'access_token': 'someOtherFooBarToken'
                    });

                        $httpBackend.expectGET(CONST.API_URL + '/test-endpoint',
                            {'Accept': 'application/json, text/plain, */*',
                             'Authorization': 'Bearer someOtherFooBarToken'}
                        ).respond(200);

                        $http.get(CONST.API_URL + '/test-endpoint');

                        $httpBackend.flush();
                    });
            });
        });

        describe('for non-API requests', function () {
            it('should not add the authorization token header', function () {
                $httpBackend.expectGET(CONST.BACKEND_URL + '/non-api-url',
                    {'Accept': 'application/json, text/plain, */*'}
                ).respond(200);

                $http.get(CONST.BACKEND_URL + '/non-api-url');

                $httpBackend.flush();
            });
        });

    });

    describe('responseError handler', function () {

        beforeEach(function () {
            spyOn($rootScope, '$broadcast').and.callThrough();
        });

        describe('for a 401 error', function () {

            describe('when logged in', function () {
                var broadcastArguments;

                beforeEach(function () {
                    mockAuthentication.loginStatus = true;
                    $httpBackend.whenGET(CONST.BACKEND_URL + '/some-url').respond(401);
                    $http.get(CONST.BACKEND_URL + '/some-url');
                    $httpBackend.flush();
                    broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                });

                it('should broadcast an "unauthorized" event over the rootScope', function () {
                    expect($rootScope.$broadcast).toHaveBeenCalled();
                    expect(broadcastArguments[0]).toEqual('event:unauthorized');
                });
            });

            describe('when logged out', function () {
                var claimedScopes, payload;
                beforeEach(function () {
                    claimedScopes = [
                    'posts',
                    'media',
                    'forms',
                    'api',
                    'tags',
                    'sets',
                    'users',
                    'stats',
                    'layers',
                    'config',
                    'messages'
                    ];
                    payload = {
                        grant_type: 'client_credentials',
                        client_id: CONST.OAUTH_CLIENT_ID,
                        client_secret: CONST.OAUTH_CLIENT_SECRET,
                        scope: claimedScopes.join(' ')
                    };
                });

                beforeEach(function () {
                    mockAuthentication.loginStatus = false;
                    $httpBackend.whenGET(CONST.API_URL + '/some-url').respond(401);
                    $http.get(CONST.API_URL + '/some-url');
                });

                it('should get a new token and retry the request', function () {
                    // Interceptor should try to get a new token
                    $httpBackend.expectPOST(CONST.BACKEND_URL + '/oauth/token',
                        payload
                    ).respond(200, {
                        'access_token': 'anotherNewToken'
                    });

                    // Then use that to load the original user
                    $httpBackend.expectGET(CONST.API_URL + '/some-url',
                        {'Accept': 'application/json, text/plain, */*',
                         'Authorization': 'Bearer anotherNewToken'}
                    ).respond(200);

                    $httpBackend.flush();
                });
            });
        });

        describe('for a non-401 error', function () {
            beforeEach(function () {
                $httpBackend.whenGET(CONST.BACKEND_URL + '/some-url').respond(200);
                $http.get(CONST.BACKEND_URL + '/some-url');
                $httpBackend.flush();
            });

            it('should not broadcast an event over the rootScope', function () {
                expect($rootScope.$broadcast).not.toHaveBeenCalled();
            });
        });
    });
});
