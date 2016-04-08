/**
 * Ushahidi Angular Google 2fa directive
 * Drop in directive for managing google 2fa
 */

module.exports = [
function (
) {
    var controller = [
        '$scope',
        '$rootScope',
        '$translate',
        'Notify',
        'UserEndpoint',
        '_',
        function (
            $scope,
            $rootScope,
            $translate,
            Notify,
            UserEndpoint,
            _
        ) {
            $scope.showEnableModal = false;
            $scope.notVerified = true;
            $scope.google2fa_otp = '';
            $scope.google2fa_url = '';

            $scope.step = 'guide';

            $scope.setStep = function (step) {
                if (!step) {
                    $scope.step = 'guide';
                } else {
                    $scope.step = step;
                }
            };

            $scope.start2faEnable = function () {
                $scope.showEnableModal = true;
            };

            $scope.update2faDisable = function () {
                $scope.user.google2fa_enabled = false;
                UserEndpoint.update($scope.user).$promise.then(function (user) {
                    $translate('notify.user.save_success', {name: user.realname}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                },
                function (errorResponse) {
                    Notify.showApiErrors(errorResponse);
                });
            };

            $scope.cancel = function () {
                $scope.showEnableModal = false;
                $scope.google2fa_otp = '';
            };

            $scope.setup = function () {
                UserEndpoint.enable2fa({id: 'me'}).$promise.then(function (result) {
                    $scope.google2fa_url = result.google2fa_url;
                    $scope.setStep('qr_verify');
                }, function (errorResponse) {
                    $scope.showEnableModal = false;
                    Notify.showApiErrors(errorResponse);
                    $scope.setStep();
                });
            };

            $scope.verificationFailed = function () {
                $scope.notVerified = true;
            };

            $scope.verificationSucceeded = function () {
                $scope.notVerified = false;
                $scope.setStep('verified');
                $scope.user.google2fa_enabled = true;
                UserEndpoint.update($scope.user).$promise.then(function (user) {
                    $translate('notify.user.save_success', {name: user.realname}).then(function (message) {
                        Notify.showNotificationSlider(message);
                    });
                }, function (errorResponse) {
                    $scope.showEnableModal = false;
                    Notify.showApiErrors(errorResponse);
                    $scope.setStep();
                });
            };

            $scope.verify = function () {
                UserEndpoint.verify2fa({
                    id: 'me',
                    google2fa_otp: $scope.google2fa_otp
                })
                .$promise
                .then(function (result) {
                    result.valid ? $scope.verificationSucceeded() : $scope.verificationFailed();
                },
                function (errorResponse) {
                    $scope.showEnableModal = false;
                    Notify.showApiErrors(errorResponse);
                    $scope.setStep();
                });
            };
        }];
    return {
        restrict: 'E',
        templateUrl: 'templates/settings/google-2fa.html',
        scope: {
            user: '='
        },
        controller: controller
    };
}];
