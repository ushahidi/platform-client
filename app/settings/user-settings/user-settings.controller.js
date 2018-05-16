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

    // Checking feature-flag for user-settings and hxl
    Features.loadFeatures().then(function () {
        if (!Features.isFeatureEnabled('user-settings') || !Features.isFeatureEnabled('hxl')) {
            $state.go('posts.map');
        }
    });

    UserSettingsEndpoint.getFresh({id: $rootScope.currentUser.userId}).$promise.then((settings) => {
        _.each(settings.results, (setting) => {
            if (setting.config_key === 'hdx_api_key') {
                $scope.hxlApiKey = '*** *** *** *** *** *** *** ' + setting.config_value.slice(setting.config_value.length - 4);
                $scope.hxlApiId = setting.id;
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
            UserSettingsEndpoint.saveCache({id: $scope.hxlApiId,  user_id: $rootScope.currentUser.userId,  config_key: 'hdx_api_key', config_value: $scope.apiKey}).$promise.then((response) => {
                $scope.hxlApiKey = '*** *** *** *** *** *** *** ' + $scope.apiKey.slice($scope.apiKey.length - 4);
                $scope.hxlApiId = response.id;
                Notify.notifyAction('settings.user_settings.api_key_saved', null, false, 'thumb-up', 'circle-icon confirmation', {callback: goToHdxView, text: 'settings.user_settings.start_tagging', callbackArg: null, actionClass: 'button button-alpha'});
            });
        }
    }
}];
