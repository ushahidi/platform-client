module.exports = [
    'Util',
    '$http',
function (
    Util,
    $http
) {

    // Get translated languages if they have been downloaded from https://www.transifex.com/api/2/languages
    var languages = $http.get('locales/languages.json')
        .then(function (response) {
            return response.data.languages;
        }, function () {
            // fallback to en-US pulled from https://www.transifex.com/api/2/languages
            // Language codes have _ replaced with -
            return [
                {
                    'rtl': false,
                    'pluralequation': 'language.pluralequation',
                    'code': 'en-US',
                    'name': 'English (United States)',
                    'nplurals': 2
                }
            ];
        });

    return languages;
}];
