var getLastUrlPart = function (url) {
    return url.substr(url.lastIndexOf('/'));
};

var loginLinkSelector = '.header a.user-login',
    logoutLinkSelector = '.header a.user-logout',
    userMenuLinkSelector = '.header .user-admin [dropdown-toggle]';

describe('authentication', function () {

    var loginLink, logoutLink;

    describe('Login link in main menu:', function () {

        beforeEach(function () {
            browser.get('/');
            loginLink = element(by.css(loginLinkSelector));
        });

        it('should exist and have the correct text', function () {
            expect(loginLink.isDisplayed()).toBe(true);
            expect(loginLink.getText()).toBe('LOG IN');
        });

        describe('clicking the login link', function () {
            beforeEach(function () {
                loginLink.click();
            });

            it('should go to the login page', function () {
                browser.getCurrentUrl().then(function (url) {
                    expect(getLastUrlPart(url)).toBe('/login');
                });
            });
        });
    }); // end 'login link in main menu'

    describe('Login page:', function () {

        var emailField,
            passwordField,
            submitButton;

        beforeEach(function () {
            browser.get('/login');
            emailField = element(by.model('email'));
            passwordField = element(by.model('password'));
            submitButton = element(by.css('button[type="submit"]'));
        });

        afterEach(function () {
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });

        it('should have a login form', function () {
            expect(emailField.isDisplayed()).toBeTruthy();
            expect(passwordField.isDisplayed()).toBeTruthy();
            expect(submitButton.isDisplayed()).toBeTruthy();
        });

        describe('submitting login form with wrong credentials', function () {
            beforeEach(function () {
                emailField.sendKeys('foo');
                passwordField.sendKeys('bar');
                submitButton.click();
            });

            it('should display the failure message', function () {
                var failureMessage = element(by.css('div.login-failed'));
                expect(failureMessage.isDisplayed()).toBeTruthy();
            });

            it('should stay on the login page', function () {
                browser.getCurrentUrl().then(function (url) {
                    expect(getLastUrlPart(url)).toBe('/login');
                });
            });
        }); // end 'submit form with wrong credentials'

        describe('submitting the form with correct credentials', function () {
            var userMenuLink;

            beforeEach(function () {
                emailField.sendKeys('admin@ush.com');
                passwordField.sendKeys('admin');
                submitButton.click();
            });

            it('should go to the home page', function () {
                browser.getCurrentUrl().then(function (url) {
                    expect(getLastUrlPart(url)).toBe('/map');
                });
            });

            it('should hide the login link', function () {
                loginLink = element(by.css(loginLinkSelector));
                expect(loginLink.isDisplayed()).toBeFalsy();
            });

            it('should show the user menu be visible', function () {
                userMenuLink = element(by.css(userMenuLinkSelector));
                expect(userMenuLink.isDisplayed()).toBeTruthy();
            });

            describe('and clicking the logout link', function () {
                beforeEach(function () {
                    userMenuLink = element(by.css(userMenuLinkSelector));
                    logoutLink = element(by.css(logoutLinkSelector));
                    loginLink = element(by.css(loginLinkSelector));

                    userMenuLink.click();
                    browser.wait(logoutLink.isDisplayed, 1000);
                    logoutLink.click();
                });

                it('should show the login link and hide user menu', function () {
                    expect(userMenuLink.isDisplayed()).toBeFalsy();
                    expect(loginLink.isDisplayed()).toBeTruthy();
                });
            });
        }); // end 'submit form with correct credentials'

    }); // end 'login form'
}); // end 'login'
