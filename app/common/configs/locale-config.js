module.exports = ['$translateProvider', function ($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escaped');

    $translateProvider.translations('en', require('../locales/en.json'));

    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
}];
