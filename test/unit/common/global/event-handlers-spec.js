describe('global event handlers', function () {

    var mockedSessionData,
        mockedAuthenticationData
        ;

    beforeEach(function () {

        var testApp = makeTestApp(),
        mockedSessionService =
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
        },
        mockedAuthenticationService =
        {
            getLoginStatus: function () {
                return mockedAuthenticationData.loginStatus;
            },
            logout : function () {
                // Just a stub
            }
        };

        testApp.service('Session', function () {
            return mockedSessionService;
        })
        .service('Authentication', function () {
            return mockedAuthenticationService;
        })
        .run(require('app/common/global/event-handlers.js'));


    });
});
