module.exports = Notify;

var scope;
var iconicSprite = require('ushahidi-platform-pattern-library/assets/img/iconic-sprite.svg');
Notify.$inject = ['_', '$q', '$rootScope', '$translate', 'SliderService', 'ModalService'];
function Notify(_, $q, $rootScope, $translate, SliderService, ModalService) {
    return {
        notify: notify,
        notifyProgress: notifyProgress,
        error: error,
        errors: errors,
        errorsPretranslated: errorsPretranslated,
        apiErrors: apiErrors,
        success: success,
        confirm: confirm,
        confirmModal: confirmModal,
        confirmDelete: confirmDelete,
        limit: limit,
        confirmTos: confirmTos,
        adminUserSetupModal: adminUserSetupModal,
        infoModal: infoModal,
        confirmLeave: confirmLeave
    };

    function notify(message, translateValues, icon, iconClass, dismiss) {
        function showSlider(message) {
            SliderService.openTemplate(message, icon, iconClass, null, false, dismiss);
        }

        $translate(message, translateValues).then(showSlider, showSlider);
    }

    function notifyProgress(message, translateValues, icon, iconClass) {
        function showSlider(message) {
            SliderService.openTemplate(message, icon, iconClass, null, false, false, true, true);
        }

        $translate(message, translateValues).then(showSlider, showSlider);
    }

    function error(errorText, translateValues) {
        function showSlider(errorText) {
            SliderService.openTemplate('<p>' + errorText + '</p>', 'warning', 'error', null, false);
        }
        $translate(errorText, translateValues).then(showSlider, showSlider);
    }

    function errorsPretranslated(errorTexts) {
        var scope = getScope();
        scope.errors = errorTexts;
        SliderService.openTemplate(require('./api-errors.html'), 'warning', 'error', scope, false);
    }

    function errors(errorTexts, translateValues) {
        var scope = getScope();

        $translate(errorTexts, translateValues).then(function (errors) {
            scope.errors = errors;
            SliderService.openTemplate(require('./api-errors.html'), 'warning', 'error', scope, false);
        });
    }

    function apiErrors(errorResponse) {
        var scope = getScope();
        scope.errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');
        if (!scope.errors) {
            return;
        }

        SliderService.openTemplate(require('./api-errors.html'), 'warning', 'error', scope, false);
    }

    function success(successText, translateValues) {
        function showSlider(successText) {
            SliderService.openTemplate('<p>' + successText + '</p>', 'thumb-up', 'confirmation');
        }

        $translate(successText, translateValues).then(showSlider, showSlider);
    }

    function confirm(confirmText, translateValues) {
        var deferred = $q.defer();

        var scope = getScope();
        scope.cancel = function () {
            deferred.reject();
            SliderService.close();
        };
        scope.confirm = function () {
            deferred.resolve();
            SliderService.close();
        };

        function showSlider(confirmText) {
            scope.confirmText = confirmText;
            SliderService.openTemplate(
                '<p>{{ confirmText }}</p>' +
                '    <button class="button-flat" ng-click="$parent.cancel()" translate="message.button.cancel">Cancel</button>' +
                '    <button class="button-beta button-flat" ng-click="$parent.confirm()" translate="message.button.default">OK</button>',
            false, false, scope, false, false);
        }

        $translate(confirmText, translateValues).then(showSlider, showSlider);

        return deferred.promise;
    }

    function confirmModal(confirmText, translateValues) {
        var deferred = $q.defer();

        var scope = getScope();
        scope.cancel = function () {
            deferred.reject();
            ModalService.close();
        };
        scope.confirm = function () {
            deferred.resolve();
            ModalService.close();
        };

        function showSlider(confirmText) {
            scope.confirmText = confirmText;
            ModalService.openTemplate(
                '<div class="form-field">' +
                '<p><i translate>notify.default.proceed_warning</i></p>' +
                '    <button class="button-flat" ng-click="$parent.cancel()" translate="message.button.cancel">Cancel</button>' +
                '    <button class="button-beta button-flat" ng-click="$parent.confirm()" translate="message.button.default">OK</button>' +
                '</div>', confirmText, false, scope, false, false);
        }

        $translate(confirmText, translateValues).then(showSlider, showSlider);

        return deferred.promise;
    }

    function infoModal(confirmText, translate) {
        var scope = getScope();
        scope.cancel = function () {
            ModalService.close();
        };
        ModalService.openTemplate(
                '<div class="form-field">' +
                '    <button class="button-alpha" ng-click="$parent.cancel()" translate="notify.generic.okay">Ok</button>' +
                '</div>', confirmText, false, scope, false, false);
    }

    function adminUserSetupModal() {
        ModalService.openTemplate('<admin-user-setup><admin-user-setup/>', 'Change your email and password', false, false, false, false);
    }

    function confirmTos() {
        var deferred = $q.defer();
        var scope = getScope();

        scope.confirm = function () {
            deferred.resolve();
            ModalService.close();
        };

        ModalService.openTemplate('<terms-of-service></terms-of-service>', ' ', false, scope, false, false);

        return deferred.promise;
    }

    function confirmDelete(confirmText, confirmWarningText, translateValues) {
        var deferred = $q.defer();
        var scope = getScope();

        if (typeof confirmWarningText === 'object') {
            translateValues = confirmWarningText;
            confirmWarningText = false;
        }

        $translate(confirmText, translateValues).then(show, show);

        function show(confirmText) {
            scope.confirmText = confirmText;
            scope.confirmWarningText = confirmWarningText || 'notify.default.proceed_warning';
            // If modal is already open?
            if (ModalService.getState()) {
                scope.cancel = function () {
                    deferred.reject();
                    SliderService.close();
                };
                scope.confirm = function () {
                    deferred.resolve();
                    SliderService.close();
                };
                // Open in slider
                SliderService.openTemplate(
                    '<p>{{ confirmText }}</p>' +
                    '<p><i translate="{{confirmWarningText}}"></i></p>' +
                    '    <button class="button-flat" ng-click="$parent.cancel()" translate="message.button.cancel">Cancel</button>' +
                    '    <button class="button-destructive button-flat" ng-click="$parent.confirm()">' +
                    '    <svg class="iconic"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + iconicSprite + '#trash"></use></svg>' +
                    '    <span translate="app.delete">Delete</span>' +
                    '    </button>',
                false, false, scope, false, false);
            } else {
                scope.cancel = function () {
                    deferred.reject();
                    ModalService.close();
                };
                scope.confirm = function () {
                    deferred.resolve();
                    ModalService.close();
                };
                // Otherwise confirm in modal
                ModalService.openTemplate(
                '<div class="form-field">' +
                '<p><i translate="{{confirmWarningText}}"></i></p>' +
                '    <button class="button-beta button-flat" ng-click="cancel()">Cancel</button>' +
                '    <button class="button-destructive button-flat" ng-click="confirm()">' +
                '    <svg class="iconic"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="' + iconicSprite + '#trash"></use></svg>' +
                '    <span translate="app.delete">Delete</span>' +
                '    </button>' +
                '</div>', confirmText, false, scope, false, false);
            }
        }

        return deferred.promise;
    }

    function confirmLeave(confirmText, translateValues) {
        var deferred = $q.defer();
        var scope = getScope();

        scope.confirm = function () {
            deferred.resolve();
            ModalService.close();
        };

        scope.save = function () {
            $rootScope.$broadcast('event:edit:post:data:mode:save');
            $rootScope.$on('event:edit:post:data:mode:saveError', function () {
                deferred.reject();
                ModalService.close();
            });
            $rootScope.$on('event:edit:post:data:mode:saveSuccess', function () {
                deferred.resolve();
                ModalService.close();
            });
        };

        ModalService.openTemplate(
                '<div class="form-field">' +
                '<p><i translate>notify.post.leave_confirm_message</i></p>' +
                '    <button class="button button-flat" ng-click="confirm()" translate>notify.post.leave_confirm</button>' +
                '    <button class="button-alpha button-flat" ng-click="save()" translate>notify.generic.save</button>' +
                '</div>', confirmText, false, scope, false, true);

        return deferred.promise;
    }

    function limit(message, translateValues) {
        var scope = getScope();

        $translate(message, translateValues).then(showSlider, showSlider);

        function showSlider(message) {
            scope.message = message;
            SliderService.openTemplate(require('./limit.html'), 'warning', 'error', scope, true, false);
        }
    }

    function getScope() {
        if (scope) {
            scope.$destroy();
        }
        scope = $rootScope.$new();
        return scope;
    }
}
