module.exports = [
    '$q',
    '$http',
    '$translate',
    '$location',
    '$rootScope',
    'ConfigEndpoint',
    '_',
    'Notify',
    'Maps',
    'Util',
    'Languages',
    'Features',
function (
    $q,
    $http,
    $translate,
    $location,
    $rootScope,
    ConfigEndpoint,
    _,
    Notify,
    Maps,
    Util,
    Languages,
    Features
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            formId: '@',
            formTemplate: '@'
        },
        templateUrl: 'templates/settings/general/settings-editor.html',
        link: function ($scope, $element, $attrs) {
            $scope.saving_config = false;
            $scope.map = {};

            $scope.fileContainer = {
                file : null
            };

            Features.loadFeatures().then(function () {
                $scope.isPrivateEnabled = Features.isFeatureEnabled('private');
            });

            $scope.site = ConfigEndpoint.get({ id: 'site' });
            $scope.userSavedSettings = false;

            $scope.timezones = [];
            var timezones = require('moment-timezone/data/packed/latest.json');

            if (timezones.zones) {
                angular.forEach(timezones.zones, function (timezone) {
                    timezone = timezone.split('|');
                    $scope.timezones.push(timezone[0]);
                });
            }
            $scope.timezones.push('UTC');

            Languages.then(function (languages) {
                $scope.languages = languages;
            });

            $scope.changeLanguage = function (code) {
                $translate.use(code).then(function (code) {
                    Languages.then(function (languages) {
                        angular.forEach(languages, function (language) {
                            if (language.code === code) {
                                $rootScope.rtlEnabled = language.rtl;
                            }
                        });
                    });
                });
            };

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

            $scope.updateConfig = function () {
                $scope.saving_config = true;

                uploadHeaderImage().then(function () {
                    $q.all([
                        ConfigEndpoint.saveCache($scope.site).$promise,
                        ConfigEndpoint.saveCache($scope.map).$promise
                    ]).then(function (result) {
                        $scope.saving_config = false;
                        updateSiteHeader();
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
