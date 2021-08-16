module.exports = [
    '$http',
function (
    $http
) {

    // Get translated languages if they have been downloaded from https://www.transifex.com/api/2/languages
    const languages = require('../locales/languages.json')
    return {
        getLanguages: function () {
            if (languages.languages && languages.languages.length > 0) {
                return languages.languages;
            } else {
                return [
                    {
                        'rtl': false,
                        'pluralequation': 'language.pluralequation',
                        'code': 'en',
                        'name': 'English',
                        'nplurals': 2
                    }
                ];
            }
        }
    }
}];
