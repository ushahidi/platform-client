module.exports = [
    '$q',
    '$scope',
    '$translate',
    'ConfigEndpoint',
    'DataProviderEndpoint',
function (
    $q,
    $scope,
    $translate,
    ConfigEndpoint,
    DataProviderEndpoint
) {

    // Displays a loading indicator when busy querying endpoints.
    $scope.saving = false;
    $scope.settings = {};
    $scope.available_providers = {};
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

                // No errors found; disable this.
                $scope.formsSubmitted[provider] = false;
            });
        } else {
            // Force the accordian group for the form is pop open, to display field errors.
            $scope.formsSubmitted[provider] = true;
            $scope.panelVisible[provider] = true;
        }
    };

    // Get data providers from backend.
    $q.all([DataProviderEndpoint.query(), ConfigEndpoint.get({ id: 'data-provider' })]).then(function (response) {
        $scope.providers = response[0];
        $scope.settings = response[1];
    });

}];
