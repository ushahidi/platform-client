module.exports = [
    '$q',
    '$rootScope',
    '$http',
    '$location',
    '$translate',
    'Util',
    'ConfigEndpoint',
    'MediaEndpoint',
    'Notify',
    'Features',
    '_',
    function (
        $q,
        $rootScope,
        $http,
        $location,
        $translate,
        Util,
        ConfigEndpoint,
        MediaEndpoint,
        Notify,
        Features,
        _
    ) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {

                $scope.saving_config = false;

                $scope.save = $translate.instant('app.save');
                $scope.saving = $translate.instant('app.saving');

                $scope.image = {
                    file: null,
                    changed: false,
                    deleted: false
                };

                ConfigEndpoint.get({ id: 'site' }).$promise.then((site) => {
                    $scope.site = site;
                });

                activate();

                function activate() {
                    Features.loadFeatures().then(function () {
                        $scope.donationEnabled = Features.isFeatureEnabled('donation');
                    });

                    // Watch for image upload changes
                    $scope.$watch('image.changed', function (changed) {
                        if (changed) {
                            uploadImage().then(function (response) {
                                $scope.site.donation.images.push({
                                    'id': response.data.id,
                                    'original_file_url': response.data.original_file_url
                                });
                                $rootScope.$broadcast('event:FileUpload');
                            }, function (errorResponse) {
                                Notify.apiErrors(errorResponse);
                            });
                        }
                    });
                }

                $scope.toggleMonetization = function () {
                    $scope.site.donation.enabled = !$scope.site.donation.enabled;
                    $scope.updateConfig();
                }

                function uploadImage() {
                    var dfd = $q.defer();
                    if ($scope.image.file) {
                        var formData = new FormData();
                        formData.append('file', $scope.image.file);

                        $http.post(
                            Util.apiUrl('/media'),
                            formData,
                            {
                                headers: {
                                    'Content-Type': undefined
                                }
                            }
                        ).then(function (response) {
                            dfd.resolve(response);
                        }, function (errorResponse) {
                            dfd.reject(errorResponse);
                        });
                    } else {
                        dfd.resolve();
                    }

                    return dfd.promise;
                };

                $scope.deleteImage = function (imageId) {
                    Notify.confirmModal('notify.donation_settings.delete_question', { name: 'image' }).
                        then(function () {
                            MediaEndpoint.delete({ id: imageId }).$promise.then(function () {
                                $scope.site.donation.images = $scope.site.donation.images.filter(image => image.id !== imageId);
                                $scope.updateConfig();
                                Notify.notify('Image deleted');
                            }, function (errorResponse) {
                                Notify.apiErrors(errorResponse);
                            });
                        });
                }

                $scope.deleteWallet = function () {
                    Notify.confirmModal('notify.donation_settings.delete_question', { name: 'wallet' }).
                        then(function () {
                            $scope.site.donation.wallet = '';
                            $scope.updateConfig();
                        });
                }

                $scope.updateConfig = function () {
                    $scope.saving_config = true;

                    ConfigEndpoint.saveCache($scope.site).$promise
                        .then(function (result) {
                            $scope.saving_config = false;
                            $rootScope.$emit('event:donation:settings:update', result.donation);
                            Notify.notify('notify.donation_settings.save_success');
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
