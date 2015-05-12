module.exports = ['$translateProvider', function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escaped');

    $translateProvider.translations('en', require('../locales/en.json'));

    $translateProvider.preferredLanguage('en');
}];
