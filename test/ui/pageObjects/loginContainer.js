module.exports = {
    elements: {
        emailField: '#email',
        passwordField: '#password',
        loginButton: {
            selector: '//button[@translate="nav.login"]',
            locateStrategy: 'xpath'
        }
    },
    commands: {
        login: function (username, password) {
            return this.waitForElementVisible('@emailField')
                .setValue('@emailField', username)
                .setValue('@passwordField', password)
                .click('@loginButton')
                .waitForElementNotPresent('@loginButton')
        }
    }
};
