module.exports = [
    '$q',
    '$http',
    '$rootScope',
    'ConfigEndpoint',
    '_',
    'Notify',
    'Util',
    'Languages',
function (
    $q,
    $http,
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
            $scope.site = ConfigEndpoint.get({ id: 'site' });

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

            // @todo move file handling to own directive, or find a 3rd party implementation
            $scope.fileNameChanged = function (element) {
                $scope.file = element.files[0];
            };
            $scope.clearHeader = function () {
                $scope.site.image_header = null;
            };

            var updateSiteHeader = function () {
                $rootScope.$broadcast('event:update:header');
            };
            var uploadHeaderImage = function () {
                var dfd = $q.defer();

                if ($scope.file) {
                    var formData = new FormData();
                    formData.append('file', $scope.file);

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
                    });
                } else {
                    dfd.resolve();
                }

                return dfd.promise;
            };

            $scope.updateConfig = function () {
                $scope.saving_config = true;

                uploadHeaderImage().then(function () {
                    $scope.site.$update({ id: 'site' }, function () {
                        $scope.saving_config = false;
                        updateSiteHeader();
                    });
                }, function (errorResponse) {
                    var errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
                    Notify.showAlerts(errors);
                });
            };
        }
    };
}];
