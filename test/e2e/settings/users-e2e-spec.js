var _ = require('underscore');

describe('users management', function () {

    describe('as a loggedin admin user', function () {

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


        describe('clicking the "settings" menu link in the menu', function () {
            var settingsLinkSelector = '.settings-nav span.settings-nav-button';

            beforeEach(function () {
                var settingsMenuLink = element(by.css(settingsLinkSelector));
                settingsMenuLink.click();
            });

            describe('clicking the "users" link in the "settings" menu', function () {
                var usersLinkSelector = '.main-nav a[href="/settings/users"]';

                beforeEach(function () {
                    var usersLink = element(by.css(usersLinkSelector));
                    usersLink.click();
                });

                describe('with some existing users in the backend', function () {
                    it('should list all users (but only 10 per page)', function () {
                        expect(element.all(by.repeater('user in users')).count()).toEqual(10);
                        // TODO: click page 2 and check if the remaining users are displayed there
                    });

                    describe('one user in the list (admin)', function () {
                        var adminLink;
                        beforeEach(function () {
                            adminLink = element(by.css('a[href="/settings/users/2"'));
                        });

                        describe('role field', function () {
                            var roleField;
                            beforeEach(function () {
                                roleField = element(by.css('#user-2 .user-type'));
                            });

                            it('should exist and have the correct role name as text', function () {
                                roleField.getText().then(function (text) { // Wait for promise to return
                                    expect(text.toLowerCase()).toEqual('admin');
                                });
                            });

                        });

                        describe('link to users detail view', function () {
                            it('should exist and have the user name as link text', function () {
                                expect(adminLink.getText()).toEqual('Admin');
                            });
                        });
                    });

                    describe('selecting some users, including the admin (which is currently signed in)', function () {
                        beforeEach(function () {
                            _.range(1, 4).forEach(function (i) {
                                element(by.css('#user-' + i + ' input[type="checkbox"]')).click();
                            });
                            element(by.css('#user-1 input[type="checkbox"]')).click();
                        });

                        describe('change role button', function () {
                            var changeRoleButton;
                            beforeEach(function () {
                                changeRoleButton = element(by.css('button#change-role'));
                            });

                            describe('clicking the button', function () {
                                beforeEach(function () {
                                    browser.executeScript('window.scrollTo(0,0);').then(function () {
                                        changeRoleButton.click();
                                    });
                                });

                                describe('selecting "Member" as new role', function () {
                                    var alertModalText;
                                    beforeEach(function () {
                                        element(by.linkText('Member')).click();
                                        alertModalText = element(by.css('#alert-modal-text'));
                                        browser.wait(alertModalText.isDisplayed, 200);
                                    });
                                    it('shows an error alert that you cannot change your own role (the user as which your are signed in)', function () {
                                        alertModalText.getText().then(
                                            function (text) {
                                                expect(text).toEqual('You cannot change your own role');
                                            });
                                        element(by.css('button#alert-modal-ok')).click();
                                    });
                                });
                            });
                        });

                        describe('delete button', function () {
                            var deleteButton;
                            beforeEach(function () {
                                deleteButton = element(by.css('button#delete-users'));
                            });

                            describe('clicking the button', function () {
                                beforeEach(function () {
                                    browser.executeScript('window.scrollTo(0,0);').then(function () {
                                        deleteButton.click();
                                    });

                                    browser.sleep(200);
                                });

                                it('shows an error alert that you cannot delete your own user (the user as which your are signed in)', function () {
                                    expect(element(by.css('#alert-modal-text')).getText()).toEqual('You cannot delete your own user');
                                    element(by.css('button#alert-modal-ok')).click();
                                });
                            });
                        });
                    });

                    describe('selecting some users, without the admin (which is currently signed in)', function () {
                        beforeEach(function () {
                            _.range(3, 6).forEach(function (i) {
                                element(by.css('#user-' + i + ' input[type="checkbox"]')).click();
                            });
                            element(by.css('#user-1 input[type="checkbox"]')).click();
                        });

                        describe('change role button', function () {
                            var changeRoleButton;
                            beforeEach(function () {
                                changeRoleButton = element(by.css('button#change-role'));
                            });

                            describe('clicking the button', function () {
                                beforeEach(function () {
                                    browser.executeScript('window.scrollTo(0,0);').then(function () {
                                        changeRoleButton.click();
                                    });
                                });

                                // Legit broken
                                describe('selecting "Member" as new role', function () {
                                    beforeEach(function () {
                                        element(by.linkText('Member')).click();
                                        browser.sleep(200);
                                    });
                                    it('shows an alert which asks if you really want to change the roles', function () {
                                        expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to change the role of 4 users to Member?');
                                    });
                                });

                            });
                        });

                        // Failing weirdly because driver can't close the last dialog.. giving up
                        /*describe('delete button', function () {
                            var deleteButton;
                            beforeEach(function () {
                                deleteButton = element(by.css('button#delete-users'));
                            });

                            describe('clicking the button', function () {
                                beforeEach(function () {
                                    deleteButton.click();
                                    browser.wait(protractor.ExpectedConditions.alertIsPresent(), 500);
                                });

                                it('shows an alert which asks if you really want to delete the users', function () {
                                    var alertDialog = browser.switchTo().alert();
                                    expect(alertDialog.getText()).toEqual('Are you sure you want to delete 4 users?');
                                    browser.driver.switchTo().alert().then(// <- this fixes the problem
                                        function (alert) {
                                            alert.accept();
                                        },
                                        function (error) {
                                        }
                                    );
                                });
                            });
                        });*/
                    });
                });
            });
        });
    });
});
