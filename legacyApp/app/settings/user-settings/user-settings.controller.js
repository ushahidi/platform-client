module.exports = [
    "$scope",
    "$rootScope",
    "Features",
    "$state",
    "_",
    "$q",
    "LoadingProgress",
    "UserSettingsEndpoint",
    "Notify",
    "AccessibilityService",
    function (
        $scope,
        $rootScope,
        Features,
        $state,
        _,
        $q,
        LoadingProgress,
        UserSettingsEndpoint,
        Notify,
        AccessibilityService
    ) {
        $scope.saveKey = saveKey;
        $scope.changeKey = changeKey;
        $scope.changeId = changeId;

        $scope.showCancel = false;
        $scope.hxlMaintainerSet = false;
        $scope.hxlApiKeySet = false;
        $scope.cancelMaintainerSet = cancelMaintainerSet;
        $scope.cancelApiKeySet = cancelApiKeySet;
        $scope.isLoading = LoadingProgress.getLoadingState;
        $scope.setFocus = AccessibilityService.setFocus;

        $scope.tempApiKey = "";
        $scope.tempMaintainerId = "";

        $scope.hdxSettings = {
            hdx_api_key: {
                id: null,
                user_id: $rootScope.currentUser.userId,
                config_key: "hdx_api_key",
                config_value: "",
            },
            hdx_maintainer_id: {
                id: null,
                user_id: $rootScope.currentUser.userId,
                config_key: "hdx_maintainer_id",
                config_value: "",
            },
        };

        // Change layout class
        $rootScope.setLayout("layout-c");

        // Checking feature-flag for user-settings and hxl
        Features.loadFeatures().then(function () {
            if (
                !Features.isFeatureEnabled("user-settings") ||
                !Features.isFeatureEnabled("hxl")
            ) {
                $state.go("posts.map.all");
            }
        });

        UserSettingsEndpoint.getFresh({
            id: $rootScope.currentUser.userId,
        }).$promise.then((settings) => {
            _.each(settings.results, (setting) => {
                setting.user_id = setting.user.id;
                updateSettings(setting);
            });
        });

        function updateSettings(setting) {
            if (setting.config_key === "hdx_api_key") {
                setting.config_value =
                    "*** *** *** *** *** *** *** " +
                    setting.config_value.slice(setting.config_value.length - 4);
                $scope.hdxSettings.hdx_api_key = setting;
                $scope.hxlApiKeySet = true;
                $scope.showCancel = true;
            }
            if (setting.config_key === "hdx_maintainer_id") {
                $scope.hxlMaintainerSet = true;
                $scope.tempMaintainerId = setting.config_value;
                $scope.hdxSettings.hdx_maintainer_id = setting;
                $scope.showCancel = true;
            }
        }

        function changeKey() {
            $scope.hxlApiKeySet = false;
        }

        function changeId() {
            $scope.hxlMaintainerSet = false;
        }

        function cancelMaintainerSet() {
            $scope.tempMaintainerId =
                $scope.hdxSettings.hdx_maintainer_id.config_value;
            $scope.hxlMaintainerSet = true;
        }

        function cancelApiKeySet() {
            $scope.tempApiKey = "";
            $scope.hxlApiKeySet = true;
        }

        function goToHdxView() {
            $state.go("settings.hdx");
        }

        function saveKey() {
            var calls = [];
            var tmpSetting;
            if ($scope.api.api_key.$dirty) {
                tmpSetting = $scope.hdxSettings.hdx_api_key;
                tmpSetting.config_value = $scope.tempApiKey;
                calls.push(UserSettingsEndpoint.saveCache(tmpSetting).$promise);
            }

            if ($scope.api.hdx_maintainer_id.$dirty) {
                tmpSetting = $scope.hdxSettings.hdx_maintainer_id;
                tmpSetting.config_value = $scope.tempMaintainerId;
                calls.push(UserSettingsEndpoint.saveCache(tmpSetting).$promise);
            }

            $q.all(calls).then((response) => {
                _.each(response, (setting) => {
                    setting.user_id = setting.user.id;
                    updateSettings(setting);
                });
                Notify.notifyAction(
                    "settings.user_settings.api_key_saved",
                    null,
                    false,
                    "thumb-up",
                    "circle-icon confirmation",
                    {
                        callback: goToHdxView,
                        text: "settings.user_settings.start_tagging",
                        callbackArg: null,
                        actionClass: "button button-alpha",
                    }
                );
            }, handleResponseErrors);
        }

        function handleResponseErrors(errorResponse) {
            Notify.apiErrors(errorResponse);
        }
    },
];
