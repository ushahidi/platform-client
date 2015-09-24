/**
 * Ushahidi First Login Config
 */

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
        templateUrl: 'templates/partials/first-time-config.html',
        scope: true,
        link: function ($scope, $element, $attrs) {
            $scope.modalOpen = false;
            $scope.site = {};
            $scope.saving_config = false;
            $scope.step = 'customize';

            // Load config, and open modal if first time login
            var checkConfig = function () {
                ConfigEndpoint.get({ id: 'site' }, function (site) {
                    $scope.site = site;
                    $scope.hasName = !!site.name;
                    // Are we and admin, and is this the first login?
                    if (_.contains(site.allowed_privileges, 'update') && site.first_login) {
                        // .. then open the modal
                        $scope.modalOpen = true;
                    }
                });
            };

            // If we're already logged in, check config immediately
            if ($rootScope.loggedin) {
                checkConfig();
            }
            // Otherwise, wait for a login event, then check config
            $rootScope.$on('event:authentication:login:succeeded', function () {
                checkConfig();
            });

            // Skip the customize step
            $scope.skip = function () {
                // Set the first login flag false, so we don't show this again
                ConfigEndpoint.update({ id: 'site', first_login: false }, function () {
                    $scope.step = 'first-post';
                });
            };
            // Close the modal
            $scope.closeModal = function () {
                $scope.modalOpen = false;
            };

            // @todo Copied from settings-editor. Move to shared directive

            // Get selected file
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

                // Set the first login flag false, so we don't show this again
                $scope.site.first_login = false;

                uploadHeaderImage().then(function () {
                    $scope.site.$update({ id: 'site' }, function () {
                        $scope.saving_config = false;
                        $scope.step = 'first-post';
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

