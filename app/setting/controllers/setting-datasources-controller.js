module.exports = [
    '$q',
    '$scope',
    '$translate',
    'ConfigEndpoint',
    'DataProviderEndpoint',
    'CacheManager',
function (
    $q,
    $scope,
    $translate,
    ConfigEndpoint,
    DataProviderEndpoint,
    CacheManager
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

            $scope.settings.$update({ id: 'data-provider' }, function () {
                $scope.saving = false;
                CacheManager.updateCacheItem(
                    'configCache', 
                    $scope.settings
                );

                // No errors found; disable this.
                $scope.formsSubmitted[provider] = false;
            });
        } else {
            // Force the accordian group for the form is pop open, to display field errors.
            $scope.formsSubmitted[provider] = true;
            $scope.panelVisible[provider] = true;
        }
    };

    // Clear provider cache so that it's loaded fresh each time
    CacheManager.removeCacheGroup('configCache', '/config/data-provider');
    CacheManager.removeCacheGroup('providerCache', '/dataproviders');

    // Get data providers from bacend.
    $q.all([DataProviderEndpoint.query(), ConfigEndpoint.get({ id: 'data-provider' })]).then(function (response) {
        $scope.providers = response[0];
        $scope.settings = response[1];
    });

}];
