var _ = require('underscore');

describe('post detail interaction', function () {
    // Selectors
    var whoCanSeeSelector = '.step span'
        , selectAllLinkSelector = '.list-actions a'
        , postSelectSelector = '.select-post input'
        , deleteButtonSelector = '.bulk-actions button'
        , postEditButtonSelector = ''
        , postCollectionsButtonSelector = ''
        , visibilityButtonsSelector = '.step select'
        , visibilityButtonsCheckedSelector = '.step select option:checked'
        , confirmationMessageSelector = '.confirmation-message-wrapper p';

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
                    visibilitySelect.element(by.cssContainingText('option', 'Member')).click();
                    browser.sleep(500);
                });
                it('should set the visibility of the post and display a confirmation', function () {
                    element(by.css(confirmationMessageSelector)).getText().then(
                        function(text) {
                          expect(text).toEqual('Post has been published for Member');
                        });
                });
            });
        });

        describe('checking bulk edit actions', function () {
           
            it('the delete button should initially be disabled', function () {
                var deleteButton = element(by.css(deleteButtonSelector));
                expect(deleteButton.isEnabled()).toEqual(false);
            });

            describe('when the user selects a posts select option', function () {
                beforeEach(function () {
                    var postSelect = element.all(by.css(postSelectSelector)).get(0);
                    postSelect.click();
                });

                it('should enable the delete button', function () {
                    var deleteButton = element(by.css(deleteButtonSelector));
                    expect(deleteButton.isEnabled()).toEqual(true);
                });

                describe('when clicking the delete button', function () {
                    
                    beforeEach(function () {
                        var deleteButton = element(by.css(deleteButtonSelector));
                        deleteButton.click();
                        browser.sleep(500);
                    });
                    
                    it('should ask to confirm the post\'s deletion', function () {
                        expect(element(by.css('#confirm-modal-text')).getText()).toEqual('Are you sure you want to delete this post?');
                    });

                    describe('when the user clicks ok', function () {
                        beforeEach(function () {
                            element(by.css('button#confirm-modal-ok')).click();
                        });

                        it('should show a deletion confirmation message', function () {
                            expect(element(by.css(confirmationMessageSelector)).getText()).toEqual('Posts deleted');
                        });
                    });
                });
            });

            describe('the user clicks select all', function () {
                beforeEach(function () {

                });
                     
                it('should select all posts', function  () {

                });
        
                it('should change select all to unselect all', function () {

                });

                it('should enable the delete button', function () {

                });
                
                describe('when clicking delete', function () {
                    it('should ask to confirm deletion', function () {
                        describe('when clicking ok', function () {
                            it('should confirm the posts deletion', function () {
                                
                            });
                        });
                    });
                });
            });
        });
    });
});

        /*
        describe('checking the editability of a post', function () {
            describe('when clicking the edit button of a post', function () {
                it('should change to the post edit page', function () {

                });
            });

            describe('when clicking the collections button of a post', function () {

                beforeEach(function () {

                });
                describe('the user will see a menu of collection options', function () {
                    it('should show existing collections with toggles', function () {

                    });

                    it('should show create collections', function () {

                    });
                });
                
                describe('when the user adds a post to a collection', function () {
                    it('should add the post to a collection', function () {

                    });
                });

                describe('when the user removes a post from a collection', function () {
                    it('should remove the post from the collection', function () {

                    });
                });

                describe('when the user creates a new collections', function () {
                    beforeEach(function () {

                    });
                    
                    it('should show the new collection input', function () {

                    });

                    describe('when the user enters a new collection and creates', function () {
                        it('should create the collection', function () {

                        });

                        it('and should add the collection to the list', function () {

                        });

                        it('and add the post to the collection', function () {

                        });
                    });
                });
            });
        });
    });

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
                    var deleteButton = element(by.css(deleteButtonSelector));
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
