describe('forms interaction', function () {
    describe('as a logged in admin user', function () {
        beforeEach(function () {
            browser.get('/login');
            element(by.model('email')).sendKeys('admin@ush.com');
            element(by.model('password')).sendKeys('admin');
            element(by.css('button[type="submit"]')).click();
            element(by.css('.view-list')).click();
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
            beforeEach(function () {
              
            });

            it('should display 2 forms', function () {

            });

            describe('When user clicks on upvote for the first form', function () {
                beforeEach(function () {

                });

                it('should change the priority of the forms', function () {

                });
            });

            describe('When user clicks on downvote for the first form', function () {
                beforeEach(function () {

                });

                it('should change the priority of the forms', function () {

                });
            });

            describe('When the user clicks delete for the first form', function () {
                beforeEach(function () {

                });

                it('should confirm the deletion of the form', function () {

                });

                describe('When the user confirms deletion of the form', function () {
                    beforeEach(function () {

                    });

                    it('should show a confirmation of the form deletion', function () {

                    });
                });
            });

            describe('When the user clicks on the first form title', function () {
                beforeEach(function () {

                });

                it('should change to the form edit page', function () {

                });
            });
        });

        describe('User clicks add post type', function () {
            beforeEach(function () {

            });

            it('should open the add post type modal', function () {

            });

            describe('User saves new post type', function () {
                beforeEach(function () {

                });
            
                it('should confirm the save and open the edit post type page', function () {

                });
            });
        });

  });
});
