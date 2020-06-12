/**
 * Page Object that contains very general elements, that appear everywhere
 */
const {client} = require('nightwatch-api');

module.exports = {
    url: function () {
        return this.api.launchUrl;
    },
    elements: {
        loginButton: {
            selector: '//a[@ng-click="login()"]',
            locateStrategy: 'xpath'
        },
        logoutButton: {
            selector: '//a[@ng-click="logout()"]',
            locateStrategy: 'xpath'
        }
    },
    commands: {
        openLoginScreen: function () {
            return this.waitForElementVisible('@loginButton').click('@loginButton')
        },
        logout: function () {
            return this.waitForElementVisible('@logoutButton').click('@logoutButton')
        }
    }
};
