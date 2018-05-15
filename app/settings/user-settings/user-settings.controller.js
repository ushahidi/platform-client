module.exports = [
    '$scope',
    '$rootScope',
    'Features',
    '$state',
    '_',
    'LoadingProgress',
    'UserSettingsEndpoint',
    'Notify',
function (
    $scope,
    $rootScope,
    Features,
    $state,
    _,
    LoadingProgress,
    UserSettingsEndpoint,
    Notify
) {
    $scope.isKeySet = isKeySet;
    $scope.saveKey = saveKey;
    $scope.newKey = newKey;
    $scope.hxlApiKey = false;
    $scope.isLoading = LoadingProgress.getLoadingState;

    // Change layout class
    $rootScope.setLayout('layout-c');

    // Checking feature-flag for user-settings
    Features.loadFeatures().then(function () {
        if (!Features.isFeatureEnabled('user-settings')) {
            $state.go('posts.map');
        }
    });

    UserSettingsEndpoint.getFresh({id: $rootScope.currentUser.userId}).$promise.then((settings) => {
        _.each(settings.results, (setting) => {
            if (setting.config_key === 'hdx_api_key') {
                $scope.hxlApiKey = '*** *** *** *** *** *** *** ' + setting.config_value.slice(setting.config_value.length - 4);
            }
        });
    });

    function isKeySet() {
        if ($scope.apiKey) {
            return true;
        }
        return false;
    }

    function newKey() {
        $scope.hxlApiKey = false;
    }

    function goToHdxView() {
        $state.go('settings.hdx');
    }

    function saveKey() {
        if ($scope.apiKey) {
            // TODO: figure out how to save user-settings
            // UserSettingsEndpoint.saveCache({user_id: $rootScope.currentUser.userId, config_key: 'hdx_api_key', config_value: $scope.apiKey}).$promise.then(() => {
            $scope.hxlApiKey = '*** *** *** *** *** *** *** ' + $scope.apiKey.slice($scope.apiKey.length - 4);
            Notify.notifyAction('settings.user_settings.api_key_saved', null, false, 'thumb-up', 'circle-icon confirmation', {callback: goToHdxView, text: 'settings.user_settings.start_tagging', callbackArg: null, actionClass: 'button button-alpha'});
            // });
        }
    }
}];
