module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$state',
    '_',
    '$q',
    'LoadingProgress',
    'UserSettingsEndpoint',
    'Notify',
function (
    $scope,
    $rootScope,
    Features,
    $state,
    _,
    $q,
    LoadingProgress,
    UserSettingsEndpoint,
    Notify
) {
    $scope.saveKey = saveKey;
    $scope.changeKey = changeKey;
    $scope.changeId = changeId;
    $scope.hxlApiKeySet = false;
    $scope.hxlMaintainerSet = false;
    $scope.isLoading = LoadingProgress.getLoadingState;
    $scope.hdxSettings = {
        'hdx_api_key': {
            id: null,
            user_id: $rootScope.currentUser.userId,
            config_key: 'hdx_api_key',
            config_value: ''
        },
        'hdx_maintainer_id': {
            id: null,
            user_id: $rootScope.currentUser.userId,
            config_key: 'hdx_maintainer_id',
            config_value: ''
        }
    };

    // Change layout class
    $rootScope.setLayout('layout-c');

    // Checking feature-flag for user-settings and hxl
    Features.loadFeatures().then(function () {
        if (!Features.isFeatureEnabled('user-settings') || !Features.isFeatureEnabled('hxl')) {
            $state.go('posts.map.all');
        }
    });

    UserSettingsEndpoint.getFresh({id: $rootScope.currentUser.userId}).$promise.then((settings) => {
        _.each(settings.results, (setting) => {
            setting.user_id = setting.user.id;
            updateSettings(setting);
        });
    });

    function updateSettings(setting) {
        if (setting.config_key === 'hdx_api_key') {
            setting.config_value = '*** *** *** *** *** *** *** ' + setting.config_value.slice(setting.config_value.length - 4);
            $scope.hdxSettings.hdx_api_key = setting;
            $scope.hxlApiKeySet = true;
        }
        if (setting.config_key === 'hdx_maintainer_id') {
            $scope.hxlMaintainerSet = true;
            $scope.hdxSettings.hdx_maintainer_id = setting;
        }
    }

    function changeKey() {
        $scope.hxlApiKeySet = false;
    }

    function changeId() {
        $scope.hxlMaintainerSet = false;
    }

    function goToHdxView() {
        $state.go('settings.hdx');
    }

    function saveKey() {
        var calls = [];

        if ($scope.api['api-key'].$dirty) {
            calls.push(
                UserSettingsEndpoint.saveCache($scope.hdxSettings.hdx_api_key).$promise
            );
        }

        if ($scope.api.hdx_maintainer_id.$dirty) {
            calls.push(
                UserSettingsEndpoint.saveCache($scope.hdxSettings.hdx_maintainer_id).$promise
            );
        }

        $q.all(calls).then((response) => {
            _.each(response, (setting) => {
                updateSettings(setting);
            });
            Notify.notifyAction('settings.user_settings.api_key_saved', null, false, 'thumb-up', 'circle-icon confirmation', {callback: goToHdxView, text: 'settings.user_settings.start_tagging', callbackArg: null, actionClass: 'button button-alpha'});
        }, handleResponseErrors);
    }

    function handleResponseErrors(errorResponse) {
        Notify.apiErrors(errorResponse);
    }
}];
