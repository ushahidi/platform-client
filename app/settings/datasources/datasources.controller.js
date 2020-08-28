module.exports = [
    '$q',
    '$http',
    '$scope',
    '$rootScope',
    '$location',
    '$translate',
    '$window',
    'moment',
    'Util',
    'ConfigEndpoint',
    'DataProviderEndpoint',
    'FormEndpoint',
    'FormAttributeEndpoint',
    'Notify',
    '_',
    'Features',
    'ModalService',
function (
    $q,
    $http,
    $scope,
    $rootScope,
    $location,
    $translate,
    $window,
    moment,
    Util,
    ConfigEndpoint,
    DataProviderEndpoint,
    FormEndpoint,
    FormAttributeEndpoint,
    Notify,
    _,
    Features,
    ModalService
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
    $scope.processing = false;
    $scope.settings = {};
    $scope.available_providers = [];
    $scope.formEnabled = [];
    $scope.surveys = {};
    $scope.formsSubmitted = {};
    $scope.panelVisible = {};
    $scope.forms = {};
    $scope.selectedForm = {};
    $scope.savedProviders = {};
    $scope.authenticable_providers = {};

    // Translate and set page title.
    $translate('settings.data_sources.data_sources').then(function (title) {
        $scope.title = title;
        $scope.$emit('setPageTitle', title);
    });

    Features.loadFeatures().then(function () {
        $scope.isGmailSupportEnabled = Features.isFeatureEnabled('gmail-support');
    });

    $scope.allowedTypeMapping = function (field_type, attribute_type) {
        if (field_type === attribute_type) {
            return true;
        }

        var allowed_text_types = ['text', 'varchar', 'title', 'description', 'markdown'];
        if (field_type === 'text' && _.contains(allowed_text_types, attribute_type)) {
            return true;
        }

        return false;
    };

    $scope.getFormAttributes = function (form, provider_id) {

        $scope.selectedForm[provider_id] = form;

        if ($scope.selectedForm[provider_id].attributes) {
            return;
        }

        $scope.selectedForm[provider_id].attributes = [];

        // Get Attributes if not previously loaded
        FormAttributeEndpoint.query({formId: form.id}).$promise.then(function (results) {
            $scope.selectedForm[provider_id].attributes = [];

            // Due to the oddness of title and description being both Post fields and Attributes
            // it is necessary to construct an index into the Post object that can be used with the
            // Laravel/Kohana function array_get/array_set
            _.each(results, function (attribute) {
                if (attribute.type === 'title' || attribute.type === 'description') {
                    attribute.post_key = attribute.type === 'title' ? attribute.type : 'content';
                } else {
                    attribute.post_key = 'values.' + attribute.key;
                }
                $scope.selectedForm[provider_id].attributes.push(attribute);
            });
        });
    };

    $scope.setSelectedForm = function (form, provider_id) {
        $scope.settings[provider_id].form_id = form.id;
        $scope.selectedForm[provider_id] = form;
        $scope.getFormAttributes(form, provider_id);
    };

    $scope.isSelectedForm = function (form_id, provider_id) {
        if ($scope.settings[provider_id]) {
            if ($scope.settings[provider_id].form_id) {
                return $scope.settings[provider_id].form_id === form_id;
            }
        }
        return false;
    };

    $scope.toggleFormAssociation = function (provider_id) {
        if ($scope.formEnabled[provider_id]) {
            if ($scope.settings[provider_id]) {
                $scope.settings[provider_id].form_id = undefined;
                $scope.selectedForm[provider_id] = undefined;
            }
        }
        $scope.formEnabled[provider_id] = !$scope.formEnabled[provider_id];
    };

    $scope.initializeProvider = function (provider) {
        if ($scope.processing) {
            return false;
        }
        if (provider === 'gmail') {
            $scope.processing = true;
            $http.get(Util.url('/api/v5/config/data-provider/gmail/initialize')).then(
                function(response) {
                    $window.open(response.data.auth_url, 'popup', 'height=700, width=550, left=300, top=200');
                    setTimeout(
                        () => ModalService.openTemplate('<gmail-auth></gmail-auth>', 'Connect Your Gmail Account', false, $scope, true, false)
                    , 3000);
                },
                function (errorResponse) { // error
                    Notify.apiErrors(errorResponse);
                }).finally(function () {
                    $scope.processing = false;
                });
        }
    };

    $scope.disconnectProvider = function (provider) {
        if ($scope.processing) {
            return false;
        }
        if (provider === 'gmail') {
            $scope.processing = true;
            $http.post(Util.url('/api/v5/config/data-provider/gmail/unauthorize')).then(
                function(response) {
                    toggleGmailConnectionButton();
                    Notify.notify(response.data.message);
                },
                function (errorResponse) { // error
                    Notify.apiErrors(errorResponse);
                }).finally(function () {
                    $scope.processing = false;
                });
        }
    }

    $scope.authorizeGmailProvider = function (code) {
        var payload = {code};
        return $http.post(Util.url('/api/v5/config/data-provider/gmail/authorize'), payload).then(
            function(response) {
                Notify.notify(response.data.message);
                toggleGmailConnectionButton();
            },
            function (errorResponse) { // error
                Notify.apiErrors(errorResponse);
            });
    };

    $scope.saveProviderSettings = function (provider) {
        if ($scope.saving) {
            return false;
        }

        var form = $scope.forms[provider];

        if (form.$valid) {
            $scope.saving = true;

            // Enable data provider when saved for the first time
            if (!(provider in $scope.savedProviders)) {
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

    var toggleGmailConnectionButton = function () {
        $scope.settings.gmail.authenticated = !$scope.settings.gmail.authenticated;
    }

    var addSavedProvider = function (provider) {
        if (!$scope.savedProviders[provider]) {
            $scope.savedProviders[provider] = true;
        }
    };

    $q.all([
      DataProviderEndpoint.queryFresh().$promise,
      ConfigEndpoint.get({ id: 'data-provider' }).$promise,
      FormEndpoint.query().$promise,
      Features.loadFeatures()
    ]).then(function (response) {
        $scope.providers = response[0];
        $scope.settings = response[1];
        $scope.surveys = response[2];
        $scope.authenticable_providers = response[1]['authenticable-providers'];
        $scope.available_providers = response[3]['data-providers'];

        // Enable form elements as appropriate
        _.forEach($scope.settings, function (provider, name) {
            if (provider.form_id) {
                $scope.toggleFormAssociation(name);
                var form = _.find($scope.surveys, function (form) {
                    return form.id === provider.form_id;
                });
                $scope.setSelectedForm(form, name);
            }
            if (provider.date) {
                $scope.settings[name].date = moment(provider.date).toDate();
            }
            // console.log(provider.date);
        });
        // Keep track of providers with saved settings
        $scope.savedProviders = {};

        _.forEach($scope.providers.results, function (provider) {
            if ($scope.settings[provider.id]) {
                addSavedProvider(provider.id);
            }
        });
    });
}];
