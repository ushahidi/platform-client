module.exports = [
    // '$scope',
    '$rootScope',
    '$translate',
    'TranslationService',
    'ConfigEndpoint', //this was missing
    'Languages',
    'moment',
function (
    // $scope,
    $rootScope,
    $translate,
    TranslationService,
    ConfigEndpoint,
    Languages,
    moment
) {

    $rootScope.rtlEnabled = false;

    $rootScope.switchRtl = function () {
        $rootScope.rtlEnabled = !$rootScope.rtlEnabled;
    };
    TranslationService.getLanguage().then(function (language) {
            translate(language);
        });

    function translate(language) {
        TranslationService.translate(language);
        require(['moment/locale/' + language + '.js'], function () {
                moment.updateLocale(language);
            });
    }
}];
