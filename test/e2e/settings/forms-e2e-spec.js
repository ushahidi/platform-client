describe('forms interaction', function () {
    var confirmationMessageSelector = '.confirmation-message-wrapper p';

    describe('as a logged in admin user', function () {
        beforeEach(function () {
            browser.get('/login');
            element(by.model('email')).sendKeys('admin@ush.com');
            element(by.model('password')).sendKeys('admin');
            element(by.css('button[type="submit"]')).click();

            var settingsLinkSelector = '.settings-nav span.settings-nav-button';
            var settingsMenuLink = element(by.css(settingsLinkSelector));
            settingsMenuLink.click();
            var postTypeLink = element(by.css('.main-nav a[href="/settings/forms"]'));
            postTypeLink.click();
        });

        afterEach(function () {
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });

        describe('When user opens page', function () {

            it('should display 2 forms', function () {
                var post_types = element.all(by.css('.settings-listing-title'));
                expect(post_types.count()).toEqual(2);

            });
            /*
            describe('Top upvote should be disabled', function () {
                var upvote;
                beforeEach(function () {
                    upvote = element.all(by.css('.upvote')).get(0);
                });

                it('should be disabled', function () {
                    expect(upvote.isEnabled()).toBe(false);
                });
            });

            describe('Bottom downvote should be disabled', function () {
                var downvote;
                beforeEach(function () {
                    downvote = element.all(by.css('.downvote')).get(1);
                });

                it('should be disabled', function () {
                    expect(downvote.isEnabled()).toBe(false);
                });
            });

            describe('When user clicks on downvote for the first form', function () {
                beforeEach(function () {
                    var downvoteButton = element.all(by.css('.downvote')).get(0);
                    downvoteButton.click();
                });

                it('should change the priority of the forms', function () {
                    var bottomElement = element.all(by.css('.settings-listing-title a')).get(1);
                    expect(topElement.getText()).toEqual('Test Form');

                });

                it('and disable the downvote button', function () {
                    var downvote = element.all(by.css('.downvote')).get(1);
                    expect(downvote.isEnabled()).toBe(false);
                });
            });

            describe('When user clicks on upvote for the second form', function () {
                beforeEach(function () {
                    var upvoteButton = element.all(by.css('.downvote')).get(0);
                    upvoteButton.click();
                });

                it('should change the priority of the forms', function () {
                    topElement = element.all(by.css('.settings-listing-title a')).get(0);
                    expect(topElement.getText()).toEqual('Missing People');
                });

                it('and disable the upvote button', function () {
                    var upvote = element.all(by.css('.upvote')).get(0);
                    expect(upvote.isEnabled()).toBe(false);
                });
            });
            */
            describe('When the user clicks delete for the first form', function () {
                beforeEach(function () {
                    var deleteButton = element.all(by.css('.button-destructive')).get(0);
                    deleteButton.click();
                    browser.sleep(200);
                });

                it('should confirm the deletion of the form', function () {
                    expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to delete this post type?');
                });

                describe('When the user confirms deletion of the form', function () {
                    beforeEach(function () {
                        var confirmModal = element(by.css('button#confirm-modal-ok'));
                        confirmModal.click();
                        browser.sleep(200);
                    });

                    it('should show a confirmation of the form deletion', function () {
                        var confirmMessage = element(by.css(confirmationMessageSelector));
                        expect(confirmMessage.getInnerHtml()).toEqual('Post type Test Form deleted');
                    });
                });
            });

            describe('When the user clicks on the first form title', function () {
                beforeEach(function () {
                    var postLink = element.all(by.css('.settings-listing-title a')).get(0);
                    postLink.click();
                });

                it('should change to the form edit page', function () {
                    expect(browser.getCurrentUrl()).toContain('forms/1');
                });
            });
        });

        describe('User clicks add post type', function () {
            var modalInputTitle, modalInputDescription, modalSubmit;

            beforeEach(function () {
                var addPostType = element(by.css('.page-header-actions button'));
                addPostType.click();
                browser.sleep(200);
            });

            it('should open the add post type modal', function () {
                var modal = element(by.css('.form-info'));
                expect(modal.isDisplayed()).toBe(true);
            });

            describe('User saves new post type', function () {

                beforeEach(function () {
                    modalInputTitle = element.all(by.css('.form-info input')).get(0);
                    modalInputDescription = element.all(by.css('.form-info input')).get(1);
                    modalInputTitle.sendKeys('Test title');
                    modalInputDescription.sendKeys('Test description');

                    modalSubmit = element(by.css('.page-content .modal-submit button'));
                    modalSubmit.click();
                });

                it('should confirm the save and open the edit post type page', function () {
                    expect(browser.getCurrentUrl()).toContain('forms/3');
                    var confirmMessage = element(by.css(confirmationMessageSelector));
                    expect(confirmMessage.getInnerHtml()).toEqual('Post Type new test title saved');
                });
            });
        });
    });
});
