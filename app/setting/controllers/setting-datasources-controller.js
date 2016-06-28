module.exports = [
    '$q',
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    'ConfigEndpoint',
    'DataProviderEndpoint',
    'Notify',
    '_',
    'Features',
function (
    $q,
    $scope,
    $rootScope,
    $location,
    $translate,
    ConfigEndpoint,
    DataProviderEndpoint,
    Notify,
    _,
    Features
) {

    // Redirect to home if not authorized
    if ($rootScope.hasManageSettingsPermission() === false) {
        return $location.path('/');
    }

    // Change layout class
    $rootScope.setLayout('layout-c');
    // Change mode
    $scope.$emit('event:mode:change', 'settings');

    // Displays a loading indicator when busy querying endpoints.
    $scope.saving = false;
    $scope.settings = {};
    $scope.available_providers = [];
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

            // Enable data provider when saved for the first time
            if (!$scope.savedProviders[provider]) {
                $scope.settings.providers[provider] = true;
            }

            $scope.settings.id = 'data-provider';
            ConfigEndpoint.saveCache($scope.settings).$promise.then(function (result) {
                $scope.saving = false;
                Notify.notify('notify.datasource.save_success');

                // Track saved provider
                addSavedProvider(provider);

            }, function (errorResponse) { // error
                Notify.apiErrors(errorResponse);
            });

            // No errors found; disable this.
            $scope.formsSubmitted[provider] = false;
        } else {
            // Force the accordian group for the form is pop open, to display field errors.
            $scope.formsSubmitted[provider] = true;
            $scope.panelVisible[provider] = true;
        }
    };

    var addSavedProvider = function (provider) {
        if (!$scope.savedProviders[provider]) {
            $scope.savedProviders[provider] = true;
        }
    };

    $q.all([DataProviderEndpoint.queryFresh().$promise, ConfigEndpoint.get({ id: 'data-provider' }).$promise]).then(function (response) {
        $scope.providers = response[0];
        $scope.settings = response[1];

        // Keep track of providers with saved settings
        $scope.savedProviders = {};

        _.forEach($scope.providers.results, function (provider) {
            if ($scope.settings[provider.id]) {
                addSavedProvider(provider.id);
            }
        });
    });

    Features.loadFeatures().then(function (features) {
        $scope.available_providers = features['data-providers'];
    });
}];
