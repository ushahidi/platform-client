var rootPath = '../../../../';

describe('Session', function () {

    var mockedLocalStorageHash,
    Session,
    emptySessionData;

    beforeEach(function () {

        emptySessionData = {
            userId: undefined,
            realname: undefined,
            email: undefined,
            role: undefined,
            permissions: undefined,
            accessToken: undefined,
            loginPath: undefined,
            gravatar: undefined
        };

        var testApp = angular.module('testApp');

        mockedLocalStorageHash = {};
        testApp.service('localStorageService', function () {
            return {
                get: function (key) {
                    return mockedLocalStorageHash[key];
                },
                set: function (key, val) {
                    mockedLocalStorageHash[key] = val;
                },
                remove: function (key) {
                    delete mockedLocalStorageHash[key];
                },
                clear: function () {
                    mockedLocalStorageHash = {};
                }
            };
        })
        .service('Session', require(rootPath + 'app/common/auth/session.service.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

    });

    beforeEach(angular.mock.module('testApp'));

    describe('getSessionData', function () {
        var returnedSessionData;

        describe('without values stored in localStorage', function () {

            beforeEach(inject(function (_Session_) {
                Session = _Session_;
            }));

            beforeEach(function () {
                returnedSessionData = Session.getSessionData();
            });

            it('returns the empty session data', function () {
                expect(returnedSessionData).toEqual(emptySessionData);
            });
        });

        describe('with values stored in localStorage', function () {

            beforeEach(function () {
                mockedLocalStorageHash = {
                    userId: '1',
                    accessToken: 'secrettoken'
                };
            });

            beforeEach(inject(function (_Session_) {
                Session = _Session_;
            }));

            beforeEach(function () {
                returnedSessionData = Session.getSessionData();
            });

            it('returns the session data with the stored values from localStorage',
            function () {
                var expectedSessionData = {
                    userId: '1',
                    realname: undefined,
                    email: undefined,
                    role: undefined,
                    permissions: undefined,
                    accessToken: 'secrettoken',
                    loginPath: undefined,
                    gravatar: undefined
                };

                expect(returnedSessionData).toEqual(expectedSessionData);
            });
        });
    });


    describe('setSessionDataEntry', function () {

        describe('without values stored in localStorage', function () {

            beforeEach(inject(function (_Session_) {
                Session = _Session_;
            }));

            beforeEach(function () {
                Session.setSessionDataEntry('userId', '1');
            });

            it('has the keys and values stored in the session', function () {
                var expectedSessionDataEntries = angular.extend({}, emptySessionData, {userId: '1'});
                expect(Session.getSessionData()).toEqual(expectedSessionDataEntries);
            });

            it('has the key and value stored in the local storage', function () {
                expect(mockedLocalStorageHash.userId).toEqual('1');
            });
        });
    });


    describe('setSessionDataEntries', function () {
        var sessionDataEntriesToSet;

        describe('without values stored in localStorage', function () {

            beforeEach(inject(function (_Session_) {
                Session = _Session_;
            }));

            beforeEach(function () {
                sessionDataEntriesToSet = {
                    userId: '1',
                    email: 'mike@ush.com'
                };
                Session.setSessionDataEntries(sessionDataEntriesToSet);
            });

            it('has the keys and values stored in the session', function () {
                var expectedSessionDataEntries = angular.extend({}, emptySessionData, sessionDataEntriesToSet);
                expect(Session.getSessionData()).toEqual(expectedSessionDataEntries);
            });

            it('has the keys and values stored in the local storage', function () {
                expect(mockedLocalStorageHash.userId).toEqual('1');
                expect(mockedLocalStorageHash.email).toEqual('mike@ush.com');
            });
        });
    });

    describe('getSessionDataEntry and getSessionDataEntries', function () {

        describe('with some values stored in localStorage before instantiating (injecting) the Session service', function () {

            beforeEach(function () {
                mockedLocalStorageHash.userId = '1';
                mockedLocalStorageHash.email = 'mike@ush.com';
            });

            beforeEach(inject(function (_Session_) {
                Session = _Session_;
            }));

            describe('getSessionDataEntry', function () {
                it('returns the correct values', function () {
                    expect(Session.getSessionDataEntry('userId')).toEqual('1');
                    expect(Session.getSessionDataEntry('email')).toEqual('mike@ush.com');
                });
            });

            describe('getSessionDataEntries', function () {
                it('returns the correct values', function () {
                    var expectedSessionDataEntries = angular.extend({}, emptySessionData, {
                        'userId': '1',
                        'email': 'mike@ush.com'
                    });
                    expect(Session.getSessionData()).toEqual(expectedSessionDataEntries);
                });
            });
        });
    });

    describe('clearSessionData', function () {

        describe('with some values stored in localStorage before instantiating (injecting) the Session service', function () {

            beforeEach(function () {
                mockedLocalStorageHash.userId = '1';
                mockedLocalStorageHash.email = 'mike@ush.com';
            });

            beforeEach(inject(function (_Session_) {
                Session = _Session_;
            }));

            it('has the values loaded in session', function () {
                expect(Session.getSessionDataEntry('userId')).toEqual('1');
                expect(Session.getSessionDataEntry('email')).toEqual('mike@ush.com');
            });

            describe('calling clearSessionData', function () {

                beforeEach(function () {
                    Session.clearSessionData();
                });

                it('has the only the initial keys with undefined values stored in the session', function () {
                    expect(Session.getSessionData()).toEqual(emptySessionData);
                });

                it('doesn\'t have any keys and values stored in the local storage', function () {
                    expect(mockedLocalStorageHash).toEqual({});
                });
            });
        });
    });
});
