describe('global event handlers', function () {

    var mockedPostFiltersService,
        mockedSessionData,
        mockedAuthenticationData,
        mockedAuthenticationService,
        mockedDemoDeploymentService,
        verifierService,
        mockTOS,
        $rootScope,
        $location,
        mockState = {
            go: jasmine.createSpy(),
            current: jasmine.createSpy(),
            reload: jasmine.createSpy()
        };

    beforeEach(function () {
        var testApp = makeTestApp();

        mockedPostFiltersService = {
            resetDefaults: function () {
                return {
                    then: function (successCallback, failCallback) {
                        return {};
                    }
                };
            }
        };
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

        mockedDemoDeploymentService =
        {
            demoCheck: function () {}
        };
        verifierService =
        {
            debugModeCheck: function () {}
        };

        spyOn(mockedAuthenticationService, 'openLogin');

        mockTOS = {
            getTosEntry: function () {
                return {
                    then: (cb) => {
                        cb();
                    }
                };
            }
        };

        spyOn(mockTOS, 'getTosEntry').and.callThrough();
        testApp.service('PostFilters', function () {
            return mockedPostFiltersService;
        })
        .service('Session', function () {
            return mockedSessionService;
        })
        .service('Authentication', function () {
            return mockedAuthenticationService;
        })
        .service('TermsOfService', function () {
            return mockTOS;
        })
        .service('DemoDeploymentService', function () {
            return mockedDemoDeploymentService;
        })
        .run(require('app/common/auth/authentication-events.run.js'))
        .service('$state', function () {
            return mockState;
        })
        .service('VerifierService', function () {
            return verifierService;
        });


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

                        it('should reload the route', function () {
                            expect(mockState.reload).toHaveBeenCalled();
                        });

                        it('should check TOS', function () {
                            expect(mockTOS.getTosEntry).toHaveBeenCalled();
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

                        it('should reload the route', function () {
                            expect(mockState.reload).toHaveBeenCalled();
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
