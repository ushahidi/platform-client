module.exports = {
    login: () => {
        browser.get('/');
        element(by.linkText('Log in')).click();
        element(by.model('email')).sendKeys('admin@ush.com');
        element(by.model('password')).sendKeys('admin');
        element(by.buttonText('Log in')).click();
    }
};
