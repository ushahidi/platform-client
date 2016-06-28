describe('post detail interaction', function () {
    // Selectors
    var selectAllLinkSelector = '.list-actions a',
        postLink = '.post-text a',
        postSelectSelector = '.select-post input',
        postCheckedSelectSelector = '.select-post input:checked',
        bulkActionButtonSelector = '.bulk-actions button',
        openCreateCollectionButton = '.form-field.bar a',
        createCollectionButton = '.form-field.bar button',
        postCollectionsButtonSelector = '.actions-content .dropdown-trigger.init.dropdown-toggle',
        postCollectionsMenuSelector = '.actions-content .dropdown-menu.init',
        collectionItem = '.form-field.checkbox input',
        visibilityButtonsSelector = '.step legend',
        confirmationMessageSelector = '.confirmation-message-wrapper p';

    describe('as a logged in admin user', function () {
        beforeEach(function () {
            browser.get('/login');
            element(by.model('email')).sendKeys('admin@ush.com');
            element(by.model('password')).sendKeys('admin');
            element(by.css('button[type="submit"]')).click();
            element(by.css('.view-list')).click();
        });

        afterEach(function () {
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });

        describe('when clicking the visibility select', function () {
            var visibilitySelect;
            beforeEach(function () {
                visibilitySelect = element.all(by.css(visibilityButtonsSelector)).get(0);
                visibilitySelect.click();
            });

            describe('when clicking a visibility option', function () {
                beforeEach(function () {
                    var optionElement = element.all(by.css('.step .radio input')).get(1);
                    optionElement.click();

                });
                it('should set the visibility of the post and display a confirmation', function () {
                    var confirmMessage = element(by.css(confirmationMessageSelector));
                    expect(confirmMessage.getInnerHtml()).toEqual('Post has been published for everyone');
                });
            });
        });

        describe('checking bulk edit actions', function () {
            it('the delete button should initially be disabled', function () {
                var deleteButton = element.all(by.css(bulkActionButtonSelector)).get(1);
                expect(deleteButton.isEnabled()).toEqual(false);
            });

            describe('when the user selects a posts select option', function () {
                beforeEach(function () {
                    var postSelect = element.all(by.css(postSelectSelector)).get(0);
                    postSelect.click();
                });

                it('should enable the delete button', function () {
                    var deleteButton = element.all(by.css(bulkActionButtonSelector)).get(1);
                    expect(deleteButton.isEnabled()).toEqual(true);
                });

                describe('when clicking the delete button', function () {
                    beforeEach(function () {
                        var deleteButton = element.all(by.css(bulkActionButtonSelector)).get(1);
                        deleteButton.click();
                        browser.sleep(200);
                    });

                    it('should ask to confirm the post\'s deletion', function () {
                        expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to delete this post?');
                    });

                    describe('when the user clicks ok', function () {
                        beforeEach(function () {
                            var confirmModal = element(by.css('button#confirm-modal-ok'));
                            confirmModal.click();
                            browser.sleep(200);
                        });

                        it('should show a deletion confirmation message', function () {
                            var confirmMessage = element(by.css(confirmationMessageSelector));
                            expect(confirmMessage.getInnerHtml()).toEqual('Posts deleted');
                        });
                    });
                });
            });

            describe('the user clicks select all', function () {
                var postSelects;

                beforeEach(function () {
                    element.all(by.css(postSelectSelector)).count().then(
                        function (count) {
                            postSelects = count;
                        });
                    element(by.css(selectAllLinkSelector)).click();
                });

                it('should select all posts', function () {
                    var postSelecteds = element.all(by.css(postCheckedSelectSelector)).count();
                    expect(postSelecteds).toEqual(postSelects);
                });
                it('should change select all to unselect all', function () {
                    element(by.css(selectAllLinkSelector)).getText().then(
                        function (text) {
                            expect(text).toEqual('Unselect All');
                        });
                });

                it('should enable the delete button', function () {
                    var deleteButton = element.all(by.css(bulkActionButtonSelector)).get(1);
                    expect(deleteButton.isEnabled()).toEqual(true);
                });

                describe('when clicking delete', function () {
                    beforeEach(function () {
                        var deleteButton = element.all(by.css(bulkActionButtonSelector)).get(1);
                        deleteButton.click();
                        browser.sleep(200);
                    });

                    it('should ask to confirm deletion', function () {
                        expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to delete this post?');
                        describe('when clicking ok', function () {
                            beforeEach(function () {
                                var confirmModal = element(by.css('button#confirm-modal-ok'));
                                confirmModal.click();
                            });

                            it('should show a deletion confirmation message', function () {
                                var confirmMessage = element(by.css(confirmationMessageSelector));
                                expect(confirmMessage.getInnerHtml()).toEqual('Posts deleted');
                            });
                        });
                    });
                });
            });
        });

        describe('checking the editability of a post', function () {
            describe('when clicking the edit button of a post', function () {
                afterEach(function () {
                    element.all(by.css('a[href="/"]')).get(0).click();
                    element(by.css('.view-list')).click();
                });

                it('should change to the post edit page', function () {
                    element.all(by.css(postLink)).get(0).click().then(function () {
                        expect(browser.getCurrentUrl()).toContain('posts/120');
                    });
                });
            });

            describe('when clicking the collections button of a post', function () {
                var collectionMenu;
                beforeEach(function () {
                    element.all(by.css(postCollectionsButtonSelector)).get(0).click();
                    collectionMenu = element.all(by.css(postCollectionsMenuSelector)).get(0);
                });

                describe('the user will see a menu of collection options', function () {
                    it('should show existing collections with toggles', function () {
                        expect(collectionMenu.isDisplayed()).toBe(true);
                    });

                    it('should show 3 collections for post 120', function () {
                        var collections = collectionMenu.all(by.css(collectionItem));
                        expect(collections.count()).toEqual(3);
                    });

                    it('with Explosion collections ticked', function () {
                        var explosion = collectionMenu.all(by.css(collectionItem)).get(1);
                        expect(explosion.isSelected()).toBe(true);
                    });
                });

                describe('when the user adds a post to a collection', function () {
                    beforeEach(function () {
                        var collectionInput = collectionMenu.all(by.css(collectionItem)).get(0);
                        collectionInput.click();
                    });

                    it('should add the post to a collection', function () {
                        var confirmMessage = element(by.css(confirmationMessageSelector));
                        expect(confirmMessage.getInnerHtml()).toEqual('Post has been added to Test collection');
                    });
                });

                describe('when the user removes a post from a collection', function () {
                    beforeEach(function () {
                        var collectionInput = collectionMenu.all(by.css(collectionItem)).get(1);
                        collectionInput.click();
                    });

                    it('should remove the post from the collection', function () {
                        var confirmMessage = element(by.css(confirmationMessageSelector));
                        expect(confirmMessage.getInnerHtml()).toEqual('Post has been removed from Explosion');

                    });
                });

                describe('when the user creates a new collections', function () {
                    var openCreateCollection, collectionInput;

                    beforeEach(function () {
                        openCreateCollection = collectionMenu.element(by.css(openCreateCollectionButton));
                        openCreateCollection.click();
                        collectionInput = element.all(by.css('#create-collection')).get(0);
                    });

                    it('should show the new collection input', function () {
                        expect(collectionInput.isDisplayed()).toBe(true);
                    });

                    it('should create the collection', function () {
                        collectionInput.sendKeys('new test collection');
                        createCollectionButton = collectionMenu.element(by.css(createCollectionButton));
                        createCollectionButton.click();
                        var confirmMessage = element(by.css(confirmationMessageSelector));
                        expect(confirmMessage.getInnerHtml()).toEqual('Post has been added to new test collection');
                    });
                });
            });
        });
    });
});
  /*
    describe('as a non-user', function () {
        beforeEach(function () {
            browser.get('/views/list');
        });

        describe('checking the visibility of each post', function () {
            var whoCanSeeArray = element(by.css(whoCanSeeSelector));
            it('should only be visible to Everyone' function () {
                _.each(whoCanSeeArray, function (item) {
                    expect(item.text.toEqual('Everyone'));
                });
            });
        });

        describe('checking the editablity of each post', function () {
            describe('when user does not have bulk action permisions', function () {
                var selectAllLink = element(by.css(selectAllLinkSelector));
                it('should not be possible to select all of the posts', function () {
                    expect(selectAllLink.toEqual(null));
                });

                it('should not be possible to see the delete button', function () {
                    var deleteButton = element(by.css(bulkActionButtonSelector)).get(1);
                    expect(deleteButton.toEqual(null));
                });
            });

            it('should not be possible to select individual posts', function () {
                var postSelects = element(by.css(postSelectSelector));

                expect(postSelects.toEqual(null));
            });

            describe('when user does not have update permission', function () {
                var editButtons = element(by.css(postEditButtonSelector));

                it('should not be possible to see the post actions buttons', function () {
                    expect(editButtons.toEqual(null));
                });

                var collectionsButtons - element(by.css(postCollectionsButtonSelector));

                it('should not be possible to see the post collections buttons', function () {
                    expect(colltionsButtons.toEqual(null);
                });
            });
        });
    });
});
    */
