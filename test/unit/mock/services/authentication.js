module.exports = [function () {
    var mockedAuthenticationData = {
        loginStatus: false
    };
    return {
        setAuthenticationData: function (authenticationData) {
            mockedAuthenticationData = authenticationData;
        },
        getLoginStatus: function () {
            return mockedAuthenticationData.loginStatus;
        },
        logout : function () {
            // Just a stub
        },
        openLogin : function () {

        }
    };
}];
