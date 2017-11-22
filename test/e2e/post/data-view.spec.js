describe('data view', function () {

    it('should show a list of posts', function () {
        browser.get('/views/data');

        expect(element(by.css('.timeline-col')).isPresent()).toBeTruthy();

        element.all(by.css('.postcard')).then(function (cards) {
            expect(cards.length).toBe(10);
        });
    });

    describe('as a loggedin admin user', function () {

        beforeEach(function () {
            protractor.helpers.login();
        });

        afterEach(function () {
            // Clear localStorage to reset session
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });
    });
});
