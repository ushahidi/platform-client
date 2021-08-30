module.exports = [
    // '$scope',
    '$rootScope',
    '$translate',
    'TranslationService',
function (
    // $scope,
    $rootScope,
    $translate,
    TranslationService
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
    }
}];
