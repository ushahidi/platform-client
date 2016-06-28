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

            var postLink = element.all(by.css('.settings-listing-title a')).get(0);
            postLink.click();

        });

        afterEach(function () {
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });

        describe('When user opens form for edit', function () {
            it('should open the form edit page', function () {
                expect(browser.getCurrentUrl()).toContain('forms/1');
            });

            describe('the title and description should be set', function () {
                it('title is Test Form, description Testing form', function () {
                    var title = element(by.css('.form-field.title input'));
                    expect(title.getAttribute('value')).toEqual('Test Form');

                    var description = element.all(by.css('.form-field textarea')).get(0);
                    expect(description.getAttribute('value')).toEqual('Testing form');
                });
            });

            describe('Top upvote', function () {
                var upvote;
                beforeEach(function () {
                    upvote = element.all(by.css('.upvote')).first();
                });

                it('should be disabled', function () {
                    expect(upvote.isEnabled()).toBe(false);
                });
            });

            describe('Bottom downvote', function () {
                var downvote;
                beforeEach(function () {
                    downvote = element.all(by.css('.downvote')).filter(function (elem) {
                        return elem.isDisplayed();
                    }).last();
                });

                it('should be disabled', function () {
                    expect(downvote.isEnabled()).toBe(false);
                });
            });

            describe('When user clicks on downvote for the first form', function () {
                beforeEach(function () {
                    var downvoteButton = element.all(by.css('.downvote')).first();
                    downvoteButton.click();
                });

                it('should change the priority of the forms', function () {
                    var bottomElement = element.all(by.css('.settings-listing h3>a')).get(1);
                    expect(bottomElement.getText()).toEqual('Test varchar');

                });

                it('and enable the upvote button', function () {
                    var downvote = element.all(by.css('.upvote')).get(1);
                    expect(downvote.isEnabled()).toBe(true);
                });
            });

            describe('When user clicks on upvote for the last field', function () {
                beforeEach(function () {
                    var upvoteButton = element.all(by.css('.upvote')).filter(function (elem) {
                        return elem.isDisplayed();
                    }).last();
                    upvoteButton.click();
                });

                it('should change the priority of the forms', function () {
                    var topElement = element.all(by.css('.settings-listing h3>a')).filter(function (elem) {
                        return elem.isDisplayed();
                    }).last();
                    expect(topElement.getText()).toEqual('Second Point');
                });

                it('and disable the downvote button', function () {
                    var downvote = element.all(by.css('.downvote')).filter(function (elem) {
                        return elem.isDisplayed();
                    }).last();
                    expect(downvote.isEnabled()).toBe(false);
                });
            });

            describe('When the user selects a stage tab', function () {
                beforeEach(function () {
                    var secondStepTab = element.all(by.css('.vertical-tabs-menu ul>li>a')).get(1);
                    secondStepTab.click();
                });

                it('The 2nd step tab should become visible', function () {
                    var activeTab = element(by.css('.vertical-tabs-menu .active span'));
                    expect(activeTab.getText()).toEqual('2nd step');
                });

                it('The 2nd step tab should contain 1 field', function () {
                    var attributes = element.all(by.css('.settings-listing h3>a')).filter(function (elem) {
                        return elem.isDisplayed();
                    });
                    expect(attributes.count()).toEqual(1);
                });

                describe('When the user clicks add new field', function () {
                    beforeEach(function () {
                        var newField = element.all(by.css('.vertical-tabs-content .page-header-actions button')).get(0);
                        newField.click();
                        browser.sleep(200);
                    });

                    it('should open a select model', function () {
                        var cards = element(by.css('.cards-select'));
                        expect(cards.isDisplayed()).toBe(true);
                    });

                    it('and should show 12 cards', function () {
                        var cards = element.all(by.css('.selection-card'));
                        expect(cards.count()).toEqual(12);
                    });

                    describe('when the user chooses a field type', function () {
                        beforeEach(function () {
                            var fieldType = element.all(by.css('.selection-card a')).get(0);
                            fieldType.click();
                        });

                        it('should add a new field to the stage tab', function () {
                            var fields = element.all(
                                    by.css('.settings-listing h3>a')).filter(function (elem) {
                                        return elem.isDisplayed();
                                    });
                            expect(fields.count()).toEqual(2);
                        });

                        it('and the field dropdown should be opened', function () {
                            var dropdown = element.all(by.css('.settings-listing form.visible'));
                            expect(dropdown.count()).toEqual(1);
                        });

                        it('and the type should match the selected type', function () {
                            var fieldType = element.all(by.css('.settings-listing h3>a')).filter(function (elem) {
                                return elem.isDisplayed();
                            }).last();
                            expect(fieldType.getText()).toEqual('New short text field');
                        });

                        describe('when the user saves a field', function () {
                            beforeEach(function () {
                                var saveClose = element.all(by.css('.settings-listing form button')).filter(function (elem) {
                                      return elem.isDisplayed();
                                  });
                                saveClose.click();
                            });

                            it('should show a confirmation of the field save', function () {
                                var confirmMessage = element(by.css(confirmationMessageSelector));
                                expect(confirmMessage.getInnerHtml()).toEqual('Field New short text field added');
                            });
                        });
                    });
                });

                describe('when the user removes a field', function () {
                    beforeEach(function () {
                        var deleteField = element.all(
                            by.css('.settings-listing .actions .button-destructive')
                        ).filter(
                            function (elem) {
                                return elem.isDisplayed();
                            }).first();
                        deleteField.click();
                        browser.sleep(200);
                    });

                    it('should confirm the deletion', function () {
                        expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to delete this field?');
                    });

                    describe('When the user confirms deletion of the form', function () {
                        beforeEach(function () {
                            var confirmModal = element(by.css('button#confirm-modal-ok'));
                            confirmModal.click();
                            browser.sleep(200);
                        });

                        it('should show a confirmation of the field deletion', function () {
                            var confirmMessage = element(by.css(confirmationMessageSelector));
                            expect(confirmMessage.getInnerHtml()).toEqual('Field Person Status deleted');
                        });
                    });

                    it('should remove the field from the stage tab', function () {
                        var fields = element.all(by.css('.settings-listing h3>a')).filter(function (elem) {
                              return elem.getText() === 'Person Status';
                          }).count();

                        expect(fields).toEqual(0);
                    });
                });

                describe('When user adds a new post type step', function () {
                    beforeEach(function () {
                        var addStep = element.all(by.cssContainingText('span', 'Add Step')).get(0);
                        addStep.click();
                        browser.sleep(200);
                    });

                    it('should open the new step modal', function () {
                        var modal = element(by.cssContainingText('.modal h3', 'Add Step'));
                        expect(modal.isDisplayed()).toBe(true);
                    });

                    describe('When user enters new step', function () {
                        beforeEach(function () {
                            var newStep = element.all(by.css('.modal')).filter(function (elem) {
                                return elem.isDisplayed();
                            });
                            var input = newStep.all(by.css('.form-info input')).get(0);
                            input.sendKeys('4th step');

                            var modalSubmit = element.all(by.css('.modal-submit')).filter(function (elem) {
                                return elem.isDisplayed();
                            });
                            modalSubmit.click();
                        });

                        it('should show a confirmation of the step adding', function () {
                            var confirmMessage = element(by.css(confirmationMessageSelector));
                            expect(confirmMessage.getInnerHtml()).toEqual('Post Type step 4th step saved');
                        });
                        /*
                         * Need to add additonal mock data to allow displaying of new steps
                         *
                         */
                    });
                });

                describe('When the user saves the post type', function () {
                    beforeEach(function () {
                        var savePostType = element(by.cssContainingText('button', 'Save Post Type'));
                        savePostType.click();
                    });

                    it('should show a confirmation message', function () {
                        var confirmMessage = element(by.css(confirmationMessageSelector));
                        expect(confirmMessage.getInnerHtml()).toEqual('Post Type Test Form updated');
                    });
                });
            });
        });
    });
});
