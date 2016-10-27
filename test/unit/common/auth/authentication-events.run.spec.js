var rootPath = '../../../../';

describe('global event handlers', function () {

    var mockedSessionData,
        mockedAuthenticationData,
        mockedAuthenticationService,
        $rootScope,
        $location;

    beforeEach(function () {

        var testApp = makeTestApp();

        var mockedSessionService =
        {
            getSessionData: function () {
                return mockedSessionData;
            },
            getSessionDataEntry: function (key) {
                return mockedSessionData[key];
            },
            setSessionDataEntry: function (key, value) {
                mockedSessionData[key] = value;
            }
        };

        mockedAuthenticationService =
        {
            getLoginStatus: function () {
                return mockedAuthenticationData.loginStatus;
            },
            logout : function () {
                // Just a stub
            },
            openLogin: function () {

            }
        };

        spyOn(mockedAuthenticationService, 'openLogin');

        testApp.service('Session', function () {
            return mockedSessionService;
        })
        .service('Authentication', function () {
            return mockedAuthenticationService;
        })
        .run(require('app/common/auth/authentication-events.run.js'));


    });

    describe('rootScope', function () {

        beforeEach(function () {

            mockedSessionData = {};
            mockedAuthenticationData = {
                loginStatus: false
            };

        });

        describe('global events', function () {
            beforeEach(function () {
                angular.mock.module('testApp');
            });

            beforeEach(angular.mock.inject(function (_$rootScope_, _$location_) {
                $rootScope = _$rootScope_;
                $location = _$location_;
            }));

            describe('authentication', function () {

                describe('login', function () {
                    describe('succeeded', function () {
                        beforeEach(function () {
                            mockedSessionData = {
                                email: 'max@example.com'
                            };

                            $rootScope.$broadcast('event:authentication:login:succeeded');
                        });

                        it('should set $rootScope.currentUser', function () {
                            expect($rootScope.currentUser.email).toEqual(mockedSessionData.email);
                        });

                        it('should set $rootScope.loggedin to true', function () {
                            expect($rootScope.loggedin).toBe(true);
                        });

                        it('should change the path to "/"', function () {
                            expect($location.path()).toEqual('/');
                        });
                    });

                    describe('failed', function () {

                        beforeEach(function () {
                            $rootScope.$broadcast('event:authentication:login:failed');
                        });

                        it('should set $rootScope.currentUser to null', function () {
                            expect($rootScope.currentUser).toEqual(null);
                        });

                        it('should set $rootScope.loggedin to false', function () {
                            expect($rootScope.loggedin).toBe(false);
                        });

                    });
                });

                describe('logout', function () {
                    describe('succeeded', function () {

                        beforeEach(function () {
                            $rootScope.$broadcast('event:authentication:logout:succeeded');
                        });

                        it('should set $rootScope.currentUser to null', function () {
                            expect($rootScope.currentUser).toEqual(null);
                        });

                        it('should set $rootScope.loggedin to false', function () {
                            expect($rootScope.loggedin).toBe(false);
                        });

                        it('should change the path to "/"', function () {
                            expect($location.path()).toEqual('/');
                        });
                    });
                });
            });

            describe('unauthorized', function () {
                beforeEach(function () {
                    $rootScope.$broadcast('event:unauthorized');
                });

                it('should set $rootScope.currentUser to null', function () {
                    expect($rootScope.currentUser).toEqual(null);
                });

                it('should set $rootScope.loggedin to false', function () {
                    expect($rootScope.loggedin).toBe(false);
                });

                it('should call openLogin', function () {
                    expect(mockedAuthenticationService.openLogin).toHaveBeenCalled();
                });
            });
        });
    });

    describe('initial setting of session data', function () {

        describe('loggedin', function () {

            beforeEach(function () {
                mockedAuthenticationData = {
                    loginStatus: true
                };

                mockedSessionData = {
                    accessToken: 'fooToken',
                    email: 'max@example.com'
                };

                angular.mock.module('testApp');
            });

            beforeEach(angular.mock.inject(function (_$rootScope_, _$location_) {
                $rootScope = _$rootScope_;
                $location = _$location_;
            }));

            it('should set $rootScope.loggedin to true', function () {
                expect($rootScope.loggedin).toBe(true);
            });

            it('should set $rootScope.currentUser', function () {
                expect($rootScope.currentUser.email).toEqual(mockedSessionData.email);
            });

        });

        describe('not loggedin', function () {

            beforeEach(function () {
                mockedAuthenticationData = {
                    loginStatus: false
                };

                angular.mock.module('testApp');
            });

            beforeEach(angular.mock.inject(function (_$rootScope_, _$location_) {
                $rootScope = _$rootScope_;
                $location = _$location_;
            }));

            it('should set $rootScope.loggedin to false', function () {
                expect($rootScope.loggedin).toBeFalsy();
            });

            it('should leave email to be undefined on $rootScope', function () {
                expect($rootScope.email).toEqual(undefined);
            });
        });
    });
});
