module.exports = [
    '$q',
    '$http',
    '$translate',
    '$location',
    '$rootScope',
    'ConfigEndpoint',
    'ApiKeyEndpoint',
    '_',
    'Notify',
    'Maps',
    'Util',
    'Languages',
    'Features',
    'Session',
    'TranslationService',
function (
    $q,
    $http,
    $translate,
    $location,
    $rootScope,
    ConfigEndpoint,
    ApiKeyEndpoint,
    _,
    Notify,
    Maps,
    Util,
    Languages,
    Features,
    Session,
    TranslationService
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            formId: '@',
            formTemplate: '@'
        },
        template: require('./settings-editor.html'),
        link: function ($scope, $element, $attrs) {
            $scope.saving_config = false;

            $scope.save = $translate.instant('app.save');
            $scope.saving = $translate.instant('app.saving');
            $scope.map = {};
            $scope.fileContainer = {
                file : null
            };
            $scope.SystemLanguage = '';

            Features.loadFeatures().then(function () {
                $scope.isPrivateEnabled = Features.isFeatureEnabled('private');
                $scope.isDisableRegistrationEnabled = Features.isFeatureEnabled('disable_registration');
            });

            // Get API Key
            ApiKeyEndpoint.query().$promise.then(function (results) {
                $scope.api_key = results[0];
            });

            ConfigEndpoint.get({ id: 'site' }).$promise.then((site) => {
                $scope.site = site;
                $scope.SystemLanguage = site.language;
            });

            $scope.userSavedSettings = false;

            $scope.clearHeader = function () {
                $scope.site.image_header = null;
            };

            var updateSiteHeader = function () {
                $rootScope.$broadcast('event:update:header');
            };

            var uploadHeaderImage = function () {
                var dfd = $q.defer();

                if ($scope.fileContainer.file) {
                    var formData = new FormData();
                    formData.append('file', $scope.fileContainer.file);

                    $http.post(
                        Util.apiUrl('/media'),
                        formData,
                        {
                            headers: {
                                'Content-Type': undefined
                            }
                        }
                    ).then(function (response) {
                        $scope.site.image_header = response.data.original_file_url;
                        dfd.resolve();
                    }, function (errorResponse) {
                        dfd.reject(errorResponse);
                    });
                } else {
                    dfd.resolve();
                }

                return dfd.promise;
            };

            $scope.generateApiKey = function () {
                Notify.confirmModal('notify.api_key.change_question').
                then(function () {
                    var persist = $scope.api_key ? ApiKeyEndpoint.update($scope.api_key) : ApiKeyEndpoint.save({});
                    persist.$promise.then(function (result) {
                        $scope.api_key = result;
                    });
                });
            };

            $scope.updateConfig = function () {
                $scope.saving_config = true;
                uploadHeaderImage().then(function () {
                    $q.all([
                        ConfigEndpoint.saveCache($scope.site).$promise,
                        ConfigEndpoint.saveCache($scope.map).$promise
                    ]).then(function (result) {
                        $scope.saving_config = false;
                        updateSiteHeader();
                        let newSystemLanguage = result[0].language;
                        let userLanguage = Session.getSessionDataEntry('language');
                        if ((userLanguage === undefined || userLanguage === null) && $scope.SystemLanguage !== newSystemLanguage) {
                            TranslationService.translate(newSystemLanguage);
                        }
                        $scope.SystemLanguage = newSystemLanguage;
                        Notify.notify('notify.general_settings.save_success');
                    }, function (errorResponse) {
                        Notify.apiErrors(errorResponse);
                        $scope.saving_config = false;
                    });
                }, function (errorResponse) {
                    Notify.apiErrors(errorResponse);
                    $scope.saving_config = false;
                });
            };

            $scope.cancel = function () {
                $location.path('/settings');
            };
        }
    };
}];
