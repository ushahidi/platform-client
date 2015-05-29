var getLastUrlPart = function (url) {
    // as an alternative to this custom regex approach,
    // we could checkout http://medialize.github.io/URI.js
    var urlRegex = /^https?:\/\/[A-Za-z0-9\-.]+(?::[0-9]+)?(.*)$/g;
    var match = urlRegex.exec(url);
    return match[1];
};

var userMenuLinkSelector = '.header .user-admin .toggle-wrapper',
userMenuSelector = '.header .user-admin .toggle-content',
userProfileLinkSelector = '.header a.my-profile';


describe('user profile management', function () {

    describe('as a loggedin user', function () {

        var userMenuLink;

        beforeEach(function () {
            browser.get('/login');

            element(by.model('username')).sendKeys('admin');
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
                browser.wait(userMenu.isDisplayed);

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

            var usernameSpanSelector = 'span#username',
            usernameSpan,
            fullnameSpanSelector = 'span#full_name',
            fullnameSpan,
            emailSpanSelector = 'span#email',
            emailSpan,

            fullnameFieldSelector = 'input[type="text"][name="realname"]',
            fullnameField,
            emailFieldSelector = 'input[type="email"][name="email"]',
            emailField,

            editProfileButtonSelector = 'button#edit_profile',
            editProfileButton,

            saveProfileButtonSelector = 'button[type="submit"]#save_profile',
            saveProfileButton,

            cancelButtonSelector = 'button[type="button"]#cancel',
            cancelButton;

            beforeEach(function () {
                browser.get('/users/me');
                browser.wait(element(by.css('.form-wrapper')).isDisplayed);

                usernameSpan = element(by.css(usernameSpanSelector));
                fullnameSpan = element(by.css(fullnameSpanSelector));
                emailSpan = element(by.css(emailSpanSelector));
                editProfileButton = element(by.css(editProfileButtonSelector));
            });

            it('should show the username, full name and email of the current user', function () {
                expect(usernameSpan.isDisplayed()).toBe(true);
                expect(usernameSpan.getText()).toBe('admin');

                expect(fullnameSpan.isDisplayed()).toBe(true);
                expect(fullnameSpan.getText()).toBe('Admin Joe');

                expect(emailSpan.isDisplayed()).toBe(true);
                expect(emailSpan.getText()).toBe('admin@example.com');
            });

            it('should show "Edit Profile" button', function () {
                expect(editProfileButton.isDisplayed()).toBe(true);
            });

            describe('clicking the "Edit Profile" button', function () {
                beforeEach(function () {
                    editProfileButton.click();

                    fullnameField = element(by.css(fullnameFieldSelector));
                    emailField = element(by.css(emailFieldSelector));

                    saveProfileButton = element(by.css(saveProfileButtonSelector));
                    cancelButton = element(by.css(cancelButtonSelector));
                });

                it('should show the editable fields for full name and email with the correct values prefilled', function () {
                    expect(fullnameField.isDisplayed()).toBe(true);
                    expect(fullnameField.getAttribute('value')).toBe('Admin Joe');

                    expect(emailField.isDisplayed()).toBe(true);
                    expect(emailField.getAttribute('value')).toBe('admin@example.com');
                });

                it('should show "Save Profile" and "Cancel" buttons', function () {
                    expect(saveProfileButton.isDisplayed()).toBe(true);
                    expect(cancelButton.isDisplayed()).toBe(true);
                });

                describe('changing fullname and email values', function () {
                    beforeEach(function () {
                        fullnameField.clear();
                        fullnameField.sendKeys('Foo Bar');

                        emailField.clear();
                        emailField.sendKeys('foo@bar.com');
                    });

                    describe('clicking the "Cancel" button', function () {
                        beforeEach(function () {
                            cancelButton.click();
                        });
                        it('should switch again to the non-edit view with the original values', function () {
                            expect(usernameSpan.isDisplayed()).toBe(true);
                            expect(usernameSpan.getText()).toBe('admin');

                            expect(fullnameSpan.isDisplayed()).toBe(true);
                            expect(fullnameSpan.getText()).toBe('Admin Joe');

                            expect(emailSpan.isDisplayed()).toBe(true);
                            expect(emailSpan.getText()).toBe('admin@example.com');
                        });
                    });

                    describe('clicking the "Save profile" button', function () {
                        beforeEach(function () {
                            saveProfileButton.click();
                        });

                        it('should switch again to the non-edit view with the just changed values', function () {
                            expect(usernameSpan.isDisplayed()).toBe(true);
                            expect(usernameSpan.getText()).toBe('admin');

                            expect(fullnameSpan.isDisplayed()).toBe(true);
                            expect(fullnameSpan.getText()).toBe('Foo Bar');

                            expect(emailSpan.isDisplayed()).toBe(true);
                            expect(emailSpan.getText()).toBe('foo@bar.com');
                        });
                    });
                });
            });
        }); // end 'link to user profile in user menu'

    }); // end 'as a loggedin user'
}); // end 'user profile management'
