/* eslint-disable quotes */
module.exports = [
    '$scope',
    '$rootScope',
    '$translate',
    '$location',
    'FormEndpoint',
    'Notify',
    '_',
    'Features',
    'SurveysSdk',
function (
    $scope,
    $rootScope,
    $translate,
    $location,
    FormEndpoint,
    Notify,
    _,
    Features,
    SurveysSdk,
    Util,
    Session
) {

    // Change layout class
    $rootScope.setLayout('layout-b');
    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    $translate('nav.posts_and_entities').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    Features.loadFeatures()
    .then(function () {
        $scope.targetedSurveysEnabled = Features.isFeatureEnabled('targeted-surveys');
    });

    // Get all the forms for display
    $scope.refreshForms = function () {
        SurveysSdk.getSurveys().then(function (forms) {
            $scope.forms = forms;
        });
    };

    $scope.deleteSurvey = function (survey) {
        Notify.deleteWithInput('survey', survey.name).then(function () {
            // If we haven't saved the survey
            // just go back to the surveys views
            if (!survey.id) {
                $location.url('/settings/surveys');
                return;
            }

            FormEndpoint.delete({
                id: survey.id
            }).$promise.then(function () {
                Notify.notify('notify.form.destroy_form_success', { name: survey.name });
                $scope.refreshForms();
            }, $scope.handleResponseErrors);
        });
    };

    $scope.handleResponseErrors = function (errorResponse) {
        Notify.apiErrors(errorResponse);
    };

    $scope.getLanguages = function (enabled_languages) {
        let languages = [...enabled_languages.available];
        languages.push(enabled_languages.default);
        let languageString = languages.length > 1 ? $translate.instant('translations.languages') : $translate.instant('translations.language');
        _.each(languages,(language, index) => {
            let divider = index !== 0 ? ',' : ':';
            languageString = `${languageString + divider} ${$translate.instant(`languages.${language}`)}`;
        });
        return languageString;
    }
    $scope.refreshForms();
}];
