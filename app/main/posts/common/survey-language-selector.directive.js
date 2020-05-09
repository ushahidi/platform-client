module.exports = SurveyLanguageSelector;

SurveyLanguageSelector.$inject = [
];

function SurveyLanguageSelector() {
    return {
        restrict: 'E',
        scope: {
            availableLanguages:'=',
            activeSurveyLanguage:'='
        },
        controller: SurveyLanguageSelectorController,
        template: require('./survey-language-selector.html')
    };
}

SurveyLanguageSelectorController.$inject = ['$scope'];

function SurveyLanguageSelectorController($scope) {

    $scope.changeLanguage = changeLanguage;


function changeLanguage(language) {
        $scope.activeSurveyLanguage.language = language;
    }
};
