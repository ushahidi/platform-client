module.exports = [
    '$q',
    '$scope',
    '$translate',
    'ConfigEndpoint',
    'DataProviderEndpoint',
    'Notify',
function (
    $q,
    $scope,
    $translate,
    ConfigEndpoint,
    DataProviderEndpoint,
    Notify
) {

    // Displays a loading indicator when busy querying endpoints.
    $scope.saving = false;
    $scope.settings = {};
    $scope.forms = {};
    $scope.formsSubmitted = {};
    $scope.panelVisible = {};

    // Translate and set page title.
    $translate('settings.data_sources.data_sources').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.saveProviderSettings = function (provider) {
        if ($scope.saving) {
            return false;
        }

        var form = $scope.forms[provider];

        if (form.$valid) {
            $scope.saving = true;

            $scope.settings.id = 'data-provider';
            ConfigEndpoint.saveCache($scope.settings).$promise.then(function (result) {
                $scope.saving = false;
                $translate('notify.datasource.save_success').then(function (message) {
                    Notify.showNotificationSlider(message);
                });
            }, function (errorResponse) { // error
                Notify.showApiErrors(errorResponse);
            });

            // No errors found; disable this.
            $scope.formsSubmitted[provider] = false;
        } else {
            // Force the accordian group for the form is pop open, to display field errors.
            $scope.formsSubmitted[provider] = true;
            $scope.panelVisible[provider] = true;
        }
    };

    // Get data providers from backend.
    ConfigEndpoint.get({ id: 'data-provider'}).$promise.then(function (response) {
        $scope.settings = response;
    });

    DataProviderEndpoint.queryFresh().$promise.then(function (response) {
        $scope.providers = response;
    });

}];
