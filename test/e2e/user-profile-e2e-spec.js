var getLastUrlPart = function (url) {
    // as an alternative to this custom regex approach,
    // we could checkout http://medialize.github.io/URI.js
    var urlRegex = /^https?:\/\/[A-Za-z0-9\-.]+(?::[0-9]+)?(.*)$/g;
    var match = urlRegex.exec(url);
    return match[1];
};

var userMenuLinkSelector = '.header .user-admin [dropdown-toggle]',
userMenuSelector = '.header .user-admin .dropdown-menu',
userProfileLinkSelector = '.header a.my-profile';


describe('user profile management', function () {

    describe('as a loggedin user', function () {

        var userMenuLink, userMenu;

        beforeEach(function () {
            browser.get('/login');

            element(by.model('email')).sendKeys('admin@ush.com');
            element(by.model('password')).sendKeys('admin');
            element(by.css('button[type="submit"]')).click();
        });

        afterEach(function () {
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });

        describe('link to user profile in user menu', function () {
            var userProfileLink;

            beforeEach(function () {
                userMenuLink = element(by.css(userMenuLinkSelector));
                userMenu = element(by.css(userMenuSelector));
                userMenuLink.click();
                browser.wait(userMenu.isDisplayed, 200);

                userProfileLink = element(by.css(userProfileLinkSelector));
            });

            it('should exist and have the correct text', function () {
                expect(userProfileLink.isDisplayed()).toBe(true);
                expect(userProfileLink.getText()).toBe('Account Settings');
            });

            describe('clicking the user profile link', function () {

                beforeEach(function () {
                    userProfileLink.click();
                });

                it('should go to users/me (edit profile page)', function () {
                    browser.getCurrentUrl().then(function (url) {
                        expect(getLastUrlPart(url)).toBe('/users/me');
                    });
                });
            });
        });

        describe('loading /users/me', function () {

            var
            fullnameFieldSelector = 'input[type="text"][name="full_name"]',
            fullnameField,
            emailFieldSelector = 'input[type="email"][name="email"]',
            emailField,
            passwordFieldSelector = 'input[type="password"][name="password"]',
            passwordField,

            saveProfileButtonSelector = 'button[type="submit"]',
            saveProfileButton,

            changePasswordLinkSelector = 'a.change-password',
            changePasswordLink,

            confirmationMessageSelector = '.alert.confirmation',
            confirmationMessage;

            beforeEach(function () {
                browser.get('/users/me');
                browser.wait(element(by.css('.user-profile')).isDisplayed);

                fullnameField = element(by.css(fullnameFieldSelector));
                emailField = element(by.css(emailFieldSelector));

                saveProfileButton = element(by.css(saveProfileButtonSelector));

                changePasswordLink = element(by.css(changePasswordLinkSelector));
            });

            it('should show the editable fields for full name and email with the correct values prefilled', function () {
                expect(fullnameField.isDisplayed()).toBe(true);
                expect(fullnameField.getAttribute('value')).toBe('Admin Joe');

                expect(emailField.isDisplayed()).toBe(true);
                expect(emailField.getAttribute('value')).toBe('admin@ush.com');
            });

            it('should show "Save Profile" buttons', function () {
                expect(saveProfileButton.isDisplayed()).toBe(true);
            });

            it('should show "Change Passowrd" links', function () {
                expect(changePasswordLink.isDisplayed()).toBe(true);
            });

            describe('changing fullname and email values', function () {
                beforeEach(function () {
                    fullnameField.clear();
                    fullnameField.sendKeys('Foo Bar');

                    emailField.clear();
                    emailField.sendKeys('foo@bar.com');
                });

                describe('clicking the "Save profile" button', function () {
                    beforeEach(function () {
                        saveProfileButton.click();
                        confirmationMessage = element(by.css(confirmationMessageSelector));
                    });

                    it('should show confirmation message', function () {
                        expect(confirmationMessage.isDisplayed()).toBe(true);
                    });
                });
            });

            describe('clicking the "Change password" button', function () {
                beforeEach(function () {
                    changePasswordLink.click();
                    passwordField = element(by.css(passwordFieldSelector));
                });


                it('should show confirmation message', function () {
                    expect(passwordField.isDisplayed()).toBe(true);
                    expect(passwordField.getAttribute('value')).toBe('');
                });
            });
        }); // end 'link to user profile in user menu'

    }); // end 'as a loggedin user'
}); // end 'user profile management'
