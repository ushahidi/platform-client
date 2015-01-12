var rootPath = '../../../../';

describe('Authentication', function(){

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        Authentication,
        signinPromiseSuccessCallback,
        mockedSessionData,
        mockedOauthTokenResponse,
        mockedUserDataResponse;

    beforeEach(function(){
        var testApp = angular.module('testApp', []);

        mockedSessionData = {};
        testApp.service('Session', function(){
            return {
                clearSessionData: function(){
                    mockedSessionData = {};
                },
                setSessionDataEntries: function(entries){
                    mockedSessionData = angular.extend({}, mockedSessionData, entries);
                },
                getSessionDataEntry: function(key){
                    return mockedSessionData[key];
                },
                setSessionDataEntry: function(key, value){
                    mockedSessionData[key] = value;
                }
            };
        })
        .service('Authentication', require(rootPath+'app/common/services/authentication.js'));

        require(rootPath+'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');

    });

    beforeEach(inject(function(_$httpBackend_, _$rootScope_, _CONST_, _Authentication_){
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        Authentication = _Authentication_;
    }));

    describe('beeing still signed out', function(){
        describe('getSigninStatus', function(){
            it('should return false', function(){
                expect(Authentication.getSigninStatus()).toBe(false);
            });
        });
    });

    describe('signin', function(){

        describe('with successfull post call to "/oauth/token"', function(){

            beforeEach(function(){
                mockedOauthTokenResponse = {
                    'access_token':'foobarfoobarfoobarfoobarfoobarfoobar',
                    'token_type':'Bearer',
                    'expires':9999999999,
                    'expires_in':3600,
                    'refresh_token':'foobarfoobarfoobarfoobarfoobarfoobar',
                    'refresh_token_expires_in':604800
                };
                $httpBackend.whenPOST(BACKEND_URL+'/oauth/token').respond(mockedOauthTokenResponse);
            });

            describe('with successfull get call to "/users/me"', function(){

                beforeEach(function(){
                    mockedUserDataResponse = {
                        'id': 2,
                        'url': 'http://ushahidi-backend/api/v2/users/2',
                        'email': 'admin@example.com',
                        'realname': 'Admin Joe',
                        'username': 'admin',
                    };
                    $httpBackend.whenGET(BACKEND_URL + '/api/v2/users/me').respond(mockedUserDataResponse);
                });

                beforeEach(function(){
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    signinPromiseSuccessCallback = jasmine.createSpy('success');

                    Authentication.signin('fooUser', 'barPassword').then(signinPromiseSuccessCallback);

                    $httpBackend.flush();
                });

                it('should add the accessToken to the Session', function(){
                    expect(mockedSessionData.accessToken).toEqual(mockedOauthTokenResponse.access_token);
                });

                it('should add the userData to the Session', function(){
                    expect(mockedSessionData.userId).toEqual(mockedUserDataResponse.id);
                    expect(mockedSessionData.userName).toEqual(mockedUserDataResponse.username);
                    expect(mockedSessionData.realName).toEqual(mockedUserDataResponse.realname);
                    expect(mockedSessionData.email).toEqual(mockedUserDataResponse.email);
                });

                it('should set signinState to true', function(){
                    expect(Authentication.getSigninStatus()).toBe(true);
                });

                it('should broadcast the "signin:succeed" event on the rootScope', function(){
                    expect($rootScope.$broadcast).toHaveBeenCalled();
                    var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                    expect(broadcastArguments[0]).toEqual('event:authentication:signin:succeeded');
                });

                it('should resolve the returned promise', function(){
                    expect(signinPromiseSuccessCallback).toHaveBeenCalled();
                });

            });
            describe('with unsuccessfull get call to "/users/me"', function(){

                var signinPromiseFailureCallback;

                beforeEach(function(){
                    $httpBackend.whenGET(BACKEND_URL + '/api/v2/users/me').respond(404, '');
                });

                beforeEach(function(){
                    spyOn($rootScope, '$broadcast').and.callThrough();

                    signinPromiseSuccessCallback = jasmine.createSpy('success');
                    signinPromiseFailureCallback = jasmine.createSpy('failure');

                    Authentication.signin('fooUser', 'barPassword').then(signinPromiseSuccessCallback, signinPromiseFailureCallback);

                    $httpBackend.flush();
                });

                it('should clear the Session data', function(){
                    expect(mockedSessionData).toEqual({});
                });

                it('should set signinState to false', function(){
                    expect(Authentication.getSigninStatus()).toBe(false);
                });

                it('should broadcast the "signin:failed" event on the rootScope', function(){
                    expect($rootScope.$broadcast).toHaveBeenCalled();
                    var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                    expect(broadcastArguments[0]).toEqual('event:authentication:signin:failed');
                });

                it('should reject the returned promise', function(){
                    expect(signinPromiseSuccessCallback).not.toHaveBeenCalled();
                    expect(signinPromiseFailureCallback).toHaveBeenCalled();
                });

            });
        });

        describe('with unsuccessfull post call to "/oauth/token"', function(){

            var signinPromiseFailureCallback;

            beforeEach(function(){
                $httpBackend.whenPOST(BACKEND_URL+'/oauth/token').respond(401, '');
            });

            beforeEach(function(){
                spyOn($rootScope, '$broadcast').and.callThrough();

                signinPromiseSuccessCallback = jasmine.createSpy('success');
                signinPromiseFailureCallback = jasmine.createSpy('failure');

                Authentication.signin('fooUser', 'barPassword').then(signinPromiseSuccessCallback, signinPromiseFailureCallback);

                $httpBackend.flush();
            });

            it('should clear the Session data', function(){
                expect(mockedSessionData).toEqual({});
            });

            it('should set signinState to false', function(){
                expect(Authentication.getSigninStatus()).toBe(false);
            });

            it('should broadcast the "signin:failed" event on the rootScope', function(){
                expect($rootScope.$broadcast).toHaveBeenCalled();
                var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
                expect(broadcastArguments[0]).toEqual('event:authentication:signin:failed');
            });

            it('should reject the returned promise', function(){
                expect(signinPromiseSuccessCallback).not.toHaveBeenCalled();
                expect(signinPromiseFailureCallback).toHaveBeenCalled();
            });

        });

    });

    describe('signout', function(){

        beforeEach(function(){
            mockedSessionData = {
                userId: 2,
                userName: 'max',
                realName: 'Max Doe',
                email: 'max@doe.org',
                accessToken: 'fooBarAccessToken'
            };

            spyOn($rootScope, '$broadcast').and.callThrough();

            Authentication.signout();
        });

        it('should broadcast the "signout:succeeded" event on the rootScope', function(){
            expect($rootScope.$broadcast).toHaveBeenCalled();
            var broadcastArguments = $rootScope.$broadcast.calls.mostRecent().args;
            expect(broadcastArguments[0]).toEqual('event:authentication:signout:succeeded');
        });

        it('should set signinState to false', function(){
            expect(Authentication.getSigninStatus()).toBe(false);
        });

        it('should clear the Session data', function(){
            expect(mockedSessionData).toEqual({});
        });

    });
});
