var _ = require('underscore');

describe('users management', function() {

    describe('as a loggedin admin user', function(){

        beforeEach(function() {
            browser.get('/login');

            element(by.model('username')).sendKeys('admin');
            element(by.model('password')).sendKeys('admin');
            element(by.css('button[type="submit"]')).click();
        });

        afterEach(function(){
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });


        describe('clicking the "tools" menu link in top menu', function(){
            var toolsMenuLinkSelector = 'a[href="/tools"]';

            beforeEach(function(){
                var toolsMenuLink = element(by.css(toolsMenuLinkSelector));
                toolsMenuLink.click();
            });

            describe('clicking the "users" link in the "tools/settings" menu', function(){
                var usersLinkSelector = 'a[href="/tools/users"]';

                beforeEach(function(){
                    var usersLink = element(by.css(usersLinkSelector));
                    usersLink.click();
                });

                describe('with some existing users in the backend', function(){
                    it('should list all users (but only 10 per page)', function(){
                        expect(element.all(by.repeater('user in users')).count()).toEqual(10);
                        // TODO: click page 2 and check if the remaining users are displayed there
                    });

                    describe('one user in the list (admin)', function(){
                        var adminLink;
                        beforeEach(function(){
                            adminLink = element(by.css('a[href="/tools/users/2"'));
                        });

                        describe('gravatar', function(){
                        });

                        describe('role field', function(){
                            var roleField;
                            beforeEach(function(){
                                roleField = element(by.css('tr#user-2 td.role'));
                            });

                            it('should exist and have the correct role name as text', function(){
                                expect(roleField.getText()).toEqual('Admin');
                            });

                        });

                        describe('link to users detail view', function(){
                            it('should exist and have the user name as link text', function(){
                                expect(adminLink.getText()).toEqual('admin');
                            });
                        });
                    });

                    describe('selecting some users, including the admin (which is currently signed in)', function(){
                        beforeEach(function(){
                            _.range(1,4).forEach(function(i){
                                element(by.css('tr#user-' + i + ' input[type="checkbox"]')).click();
                            });
                            element(by.css('tr#user-1 input[type="checkbox"]')).click();
                        });

                        describe('change role button', function(){
                            var changeRoleButton;
                            beforeEach(function(){
                               changeRoleButton = element(by.css('button#change-role'));
                            });

                            describe('clicking the button', function(){
                                beforeEach(function(){
                                   changeRoleButton.click();
                                });

                                describe('selecting "Guest" as new role', function(){
                                    beforeEach(function(){
                                        element(by.linkText('Guest')).click();
                                    });
                                    it('shows an error alert that you cannot change your own role (the user as which your are signed in)', function(){
                                        var alertDialog = browser.switchTo().alert();
                                        expect(alertDialog.getText()).toEqual('You cannot change your own role');
                                        browser.driver.switchTo().alert().then( // <- this fixes the problem
                                            function (alert) {
                                                alert.accept();
                                            },
                                            function (error) {
                                            }
                                        );
                                    });
                                });

                            });
                        });

                        describe('delete button', function(){
                            var deleteButton;
                            beforeEach(function(){
                                deleteButton = element(by.css('button#delete-users'));
                            });

                            describe('clicking the button', function(){
                                beforeEach(function(){
                                    deleteButton.click();
                                });

                                it('shows an error alert that you cannot delete your own user (the user as which your are signed in)', function(){
                                    var alertDialog = browser.switchTo().alert();
                                    expect(alertDialog.getText()).toEqual('You cannot delete your own user');
                                    browser.driver.switchTo().alert().then( // <- this fixes the problem
                                        function (alert) {
                                            alert.accept();
                                        },
                                        function (error) {
                                        }
                                    );
                                });
                            });
                        });
                    });

                    describe('selecting some users, without the admin (which is currently signed in)', function(){
                        beforeEach(function(){
                            _.range(3,6).forEach(function(i){
                                element(by.css('tr#user-' + i + ' input[type="checkbox"]')).click();
                            });
                            // element.all(by.css('tr.user input[type="checkbox"]')).then(function(userCheckBoxes){
                            //
                            // });
                            element(by.css('tr#user-1 input[type="checkbox"]')).click();
                        });

                        describe('change role button', function(){
                            var changeRoleButton;
                            beforeEach(function(){
                               changeRoleButton = element(by.css('button#change-role'));
                            });

                            describe('clicking the button', function(){
                                beforeEach(function(){
                                   changeRoleButton.click();
                                });

                                describe('selecting "Guest" as new role', function(){
                                    beforeEach(function(){
                                        element(by.linkText('Guest')).click();
                                    });
                                    it('shows an alert which asks if you really want to change the roles', function(){
                                        var alertDialog = browser.switchTo().alert();
                                        expect(alertDialog.getText()).toEqual('Are you sure you want to change the role of 4 users to Guest?');
                                        browser.driver.switchTo().alert().then( // <- this fixes the problem
                                            function (alert) {
                                                alert.accept();
                                            },
                                            function (error) {
                                            }
                                        );
                                    });
                                });

                            });
                        });

                        describe('delete button', function(){
                            var deleteButton;
                            beforeEach(function(){
                                deleteButton = element(by.css('button#delete-users'));
                            });

                            describe('clicking the button', function(){
                                beforeEach(function(){
                                    deleteButton.click();
                                });

                                it('shows an alert which asks if you really want to delete the users', function(){
                                    var alertDialog = browser.switchTo().alert();
                                    expect(alertDialog.getText()).toEqual('Are you sure you want to delete 4 users?');
                                    browser.driver.switchTo().alert().then( // <- this fixes the problem
                                        function (alert) {
                                            alert.accept();
                                        },
                                        function (error) {
                                        }
                                    );
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
