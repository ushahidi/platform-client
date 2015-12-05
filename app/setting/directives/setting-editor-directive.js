module.exports = [
    '$q',
    '$http',
    '$translate',
    '$rootScope',
    'ConfigEndpoint',
    '_',
    'Notify',
    'Util',
    'Languages',
function (
    $q,
    $http,
    $translate,
    $rootScope,
    ConfigEndpoint,
    _,
    Notify,
    Util,
    Languages
) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            formId: '@',
            formTemplate: '@'
        },
        templateUrl: 'templates/settings/settings-editor.html',
        link: function ($scope, $element, $attrs) {
            $scope.saving_config = false;
            $scope.fileContainer = {
                file : null
            };

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

            $scope.languages = Languages.languages;

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
                    ConfigEndpoint.saveCache($scope.site).$promise.then(function (result) {
                        $scope.saving_config = false;
                        updateSiteHeader();
                        $translate('notify.general_settings.save_success').then(function (message) {
                            Notify.showNotificationSlider(message);
                        });
                    }, function (errorResponse) {
                        Notify.showApiErrors(errorResponse);
                        $scope.saving_config = false;
                    });
                }, function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                    $scope.saving_config = false;
                });
            };
        }
    };
}];
