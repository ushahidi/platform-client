var getLastUrlPart = function(url){
    return url.substr(url.lastIndexOf('/'));
};

var ptor = protractor.getInstance();

var signinLinkSelector = 'a#signin-link';
var signoutLinkSelector = 'a#signout-link';
var userMenuLinkSelector = 'a#user-menu-link';


describe('authentication:', function() {

    describe('sign in link in main menu:', function(){

        var signinLink;

        beforeEach(function() {
            browser.get('/');
            signinLink = element(by.css(signinLinkSelector));
        });

        it('should exist and have the correct text', function(){
            expect(signinLink.isDisplayed()).toBe(true);
            expect(signinLink.getText()).toBe('Login');
        });

        describe('clicking the signin link', function(){
            beforeEach(function(){
                signinLink.click();
            });

            it('should go to the signin page', function(){
                ptor.getCurrentUrl().then(function(url){
                    expect(getLastUrlPart(url)).toBe('/signin');
                });
            });
        });
    }); // end 'sign in link in main menu'

    describe('sign in form:', function(){

        var usernameField;
        var passwordField;
        var submitButton;

        beforeEach(function(){
            browser.get('/signin');
            usernameField = element(by.model('username'));
            passwordField = element(by.model('password'));
            submitButton = element(by.css('button[type="submit"]'));
        });

        it('should have a sign in form', function(){
            expect(usernameField.isDisplayed()).toBeTruthy();
            expect(passwordField.isDisplayed()).toBeTruthy();
            expect(submitButton.isDisplayed()).toBeTruthy();
        });

        describe('submit form with wrong credentials', function(){
            beforeEach(function(){
                usernameField.sendKeys('foo');
                passwordField.sendKeys('bar');
                submitButton.click();
            });

            it('should stay on the sign in page', function(){
                ptor.getCurrentUrl().then(function(url){
                    expect(getLastUrlPart(url)).toBe('/signin');
                });
            });
        }); // end 'submit form with wrong credentials'

        describe('submit form with correct credentials', function(){
            beforeEach(function(){
                usernameField.sendKeys('admin');
                passwordField.sendKeys('admin');
                submitButton.click();
            });

            it('should go to the home page', function(){
                ptor.getCurrentUrl().then(function(url){
                    expect(getLastUrlPart(url)).toBe('/map');
                });
            });

            describe('signout link in the user menu', function(){
                var signinLink, signoutLink, userMenuLink;

                beforeEach(function(){
                    signinLink = element(by.css(signinLinkSelector));
                    userMenuLink = element(by.css(userMenuLinkSelector));
                    signoutLink = element(by.css(signoutLinkSelector));
                });

                it('should exist instead of the signin link', function(){
                    expect(signinLink.isDisplayed()).toBeFalsy();
                    userMenuLink.click();
                    expect(signoutLink.isDisplayed()).toBeTruthy();
                });

                describe('clicking the signout link', function(){

                    beforeEach(function(){
                        userMenuLink.click();
                        signoutLink.click();
                    });

                    it('should change again to the signin link', function(){
                        expect(userMenuLink.isDisplayed()).toBeFalsy();
                        expect(signoutLink.isDisplayed()).toBeFalsy();
                        expect(signinLink.isDisplayed()).toBeTruthy();
                    });
                });
            });
        }); // end 'submit form with correct credentials'

    }); // end 'sign in form'
}); // end 'sign in'
