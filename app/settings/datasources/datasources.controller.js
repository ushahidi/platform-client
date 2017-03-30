module.exports = [
    '$q',
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    'ConfigEndpoint',
    'DataProviderEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
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
    FormEndpoint,
    FormAttributeEndpoint,
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
    $scope.selectedForm = {};

    FormEndpoint.query().$promise.then(function (response) {
        $scope.forms = response;
    });

    // Translate and set page title.
    $translate('settings.data_sources.data_sources').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    $scope.getFormAttributes = function (form) {

        $scope.currentForm = form;

        if (form.attributes) {
            return;
        }
        // Get Attributes if not previously loaded
        FormAttributeEndpoint.get({form_id: form.id}).$promise.then(function (result) {
            // Ignore non-text fields
            var attributes = [];
            angular.foreach(result, function (attribute) {
                if (attribute.type === 'text') {
                    attributes.push(attribute);
                }
            });

            // Append to the correct form
            angular.foreach($scope.forms, function (form) {
              if (form.id === $scope.currentForm.id) {
                  form.attributes = attributes;
              }
            });
        });
    };

    $scope.setSelectedForm = function (form, provider_id) {
        $scope.settings[provider_id].form_id = form.id;
    };

    $scope.isSelectedForm = function (form_id, provider_id) {
        if ($scope.settings[provider_id].form_id) {
            return $scope.settings[provider_id].form_id === form_id;
        }
        return false;
    };

    $scope.toggleFormAssociation = function (provider_id) {
        $scope.setFormEnabled = !$scope.setFormEnabled;
        if ($scope.settings[provider_id].form_id) {
            $scope.settings[provider_id].form_id = undefined;
            if ($scope.settings[provider_id].form_destination_field_uuid) {
                $scope.settings[provider_id].form_destination_field_uuid = undefined;
            }
        }
    };

    $scope.setAttributeUUID = function (attribute_key, provider_id) {
        $scope.settings[provider_id].form_destination_field_uuid = attribute_key;
    };

    $scope.isSelectedAttribute = function (attribute_key, provider_id) {
        if ($scope.settings[provider_id].form_destination_field_uuid) {
            return $scope.settings[provider_id].form_destination_field_uuid === attribute_key;
        }
        return false;
    };

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
