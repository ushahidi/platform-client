module.exports = Notify;

var scope;

Notify.$inject = ['_', '$q', '$rootScope', '$translate', 'SliderService', 'ModalService'];
function Notify(_, $q, $rootScope, $translate, SliderService, ModalService) {
    return {
        notify: notify,
        error: error,
        errors: errors,
        apiErrors: apiErrors,
        success: success,
        confirm: confirm,
        confirmModal: confirmModal,
        confirmDelete: confirmDelete,
        limit: limit
    };

    function notify(message, translateValues) {
        $translate(message, translateValues).then(function (message) {
            SliderService.openTemplate('<p>' + message + '</p>');
        });
    }

    function error(errorText, translateValues) {
        $translate(errorText, translateValues).then(function (errorText) {
            SliderService.openTemplate('<p>' + errorText + '</p>', 'warning', 'error');
        });
    }

    function errors(errorTexts) {
        var scope = getScope();

        $q.all(_.map(errorTexts, $translate)).then(function (errors) {
            scope.errors = errors;
            SliderService.openUrl('templates/common/notifications/api-errors.html', 'warning', 'error', scope);
        });
    }

    function apiErrors(errorResponse) {
        var scope = getScope();
        scope.errors = _.pluck(errorResponse.data && errorResponse.data.errors, 'message');

        if (!scope.errors) {
            return;
        }

        SliderService.openUrl('templates/common/notifications/api-errors.html', 'warning', 'error', scope);
    }

    function success(successText, translateValues) {
        $translate(successText, translateValues).then(function (successText) {
            SliderService.openTemplate('<p>' + successText + '</p>', 'thumb-up', 'confirmation');
        });
    }

    function confirm(confirmText, translateValues) {
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

        $translate(confirmText, translateValues).then(function (confirmText) {
            scope.confirmText = confirmText;
            SliderService.openTemplate(
                '<p>{{ confirmText }}</p>' +
                '<div class="form-field">' +
                '    <button class="button-flat" ng-click="$parent.cancel()">Cancel</button>' +
                '    <button class="button-beta button-flat" ng-click="$parent.confirm()">Delete</button>' +
                '</div>',
            'question-mark', false, scope);
        });

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

        $translate(confirmText, translateValues).then(function (confirmText) {
            scope.confirmText = confirmText;
            ModalService.openTemplate(
                '<div class="form-field">' +
                '    <button class="button-flat" ng-click="$parent.cancel()">Cancel</button>' +
                '    <button class="button-beta button-flat" ng-click="$parent.confirm()">Delete</button>' +
                '</div>', confirmText, false, scope, false, false);
        });

        return deferred.promise;
    }

    function confirmDelete(confirmText, translateValues) {
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

        $translate(confirmText, translateValues).then(function (confirmText) {
            ModalService.openTemplate(
            '<div class="form-field">' +
            '    <button class="button-beta button-flat" ng-click="$parent.cancel()">Cancel</button>' +
            '    <button class="button-destructive button-flat" ng-click="$parent.confirm()">' +
            '    <svg class="iconic"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../img/iconic-sprite.svg#trash"></use></svg>' +
            '    Delete' +
            '    </button>' +
            '</div>', confirmText, false, scope, false, false);
        });

        return deferred.promise;
    }

    function limit(message, translateValues) {
        var scope = getScope();

        $translate(message, translateValues).then(function (message) {
            scope.message = message;
            SliderService.openUrl('templates/common/notifications/limit.html', 'warning', 'error', scope);
        });
    }

    function getScope() {
        if (scope) {
            scope.$destroy();
        }
        scope = $rootScope.$new();
        return scope;
    }
}
