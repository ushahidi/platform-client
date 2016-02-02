var _ = require('underscore');

describe('roles management', function () {

    describe('as a loggedin admin role', function () {

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

            describe('clicking the "roles" link in the "settings" menu', function () {
                var rolesLinkSelector = '.main-nav a[href="/settings/roles"]';

                beforeEach(function () {
                    var rolesLink = element(by.css(rolesLinkSelector));
                    rolesLink.click();
                });

                describe('with some existing roles in the backend', function () {
                    it('should list all roles (but only 10 per page)', function () {
                        expect(element.all(by.repeater('role in roles')).count()).toEqual(10);
                        // TODO: click page 2 and check if the remaining roles are displayed there
                    });

                    describe('open existing role', function () {
                        var adminLink;
                        beforeEach(function () {
                            adminLink = element(by.css('a[href="/settings/roles/2"'));
                        });

                        describe('link to roles detail view', function () {
                            it('should exist and have the role name as link text', function () {
                                expect(adminLink.getText()).toEqual('Admin');
                            });
                        });
                    });

                    describe('When user clicks create new role', function () {
                        beforeEach(function () {

                        });

                        it('should open the create role page', function () {

                        });

                        it('should show available permission types', function () {

                        });

                        describe('when user saves new role', function () {
                            beforeEach(function () {
                                var confirmModal = element(by.css('button#confirm-modal-ok'));
                                confirmModal.click();
                                browser.sleep(500);
                            });

                            it('should show a confirmation of the role creation', function () {
                                var confirmMessage = element(by.css(confirmationMessageSelector));
                                expect(confirmMessage.getInnerHtml()).toEqual('Role type Test Role created');
                            });
                        });
                    });

                    describe('selecting some roles', function () {
                        beforeEach(function () {
                            _.range(1, 4).forEach(function (i) {
                                element(by.css('#role-' + i + ' input[type="checkbox"]')).click();
                            });
                            element(by.css('#role-1 input[type="checkbox"]')).click();
                        });

                        describe('delete button', function () {
                            var deleteButton;
                            beforeEach(function () {
                                deleteButton = element(by.css('button#delete-roles'));
                            });

                            describe('clicking the button', function () {
                                beforeEach(function () {
                                    browser.executeScript('window.scrollTo(0,0);').then(function () {
                                        deleteButton.click();
                                    });
                                    browser.sleep(500);
                                });

                                it('should confirm the deletion of the roles', function () {
                                    expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to delete these roles?');
                                });

                                describe('When the user confirms deletion of the roles', function () {
                                    beforeEach(function () {
                                        var confirmModal = element(by.css('button#confirm-modal-ok'));
                                        confirmModal.click();
                                        browser.sleep(500);
                                    });

                                    it('should show a confirmation of the roles deletion', function () {
                                        var confirmMessage = element(by.css(confirmationMessageSelector));
                                        expect(confirmMessage.getInnerHtml()).toEqual('Roles deleted');
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
