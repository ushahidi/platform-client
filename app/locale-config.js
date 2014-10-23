module.exports = ['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en', require('./locales/en.json'));

    $translateProvider.preferredLanguage('en');

}];
