module.exports = ModalService;

ModalService.$inject = ['$rootScope', '$q', '$templateRequest'];
function ModalService($rootScope, $q, $templateRequest) {
    var deferredOpen = $q.defer(),
        deferredClose = $q.defer();

    return {
        open: openUrl,
        openUrl: openUrl,
        openTemplate: openTemplate,
        close: close,
        onOpen: onOpen,
        onClose: onClose
    };

    function openUrl(templateUrl, title, icon, scope, closeOnOverlayClick, showCloseButton) {
        deferredOpen.promise.then(function () {
            // Load template
            $templateRequest(templateUrl).then(function (template) {
                $rootScope.$emit('modal:open', template, title, icon, scope, closeOnOverlayClick, showCloseButton);
            });
        });
    }

    function openTemplate(template, title, icon, scope, closeOnOverlayClick, showCloseButton) {
        deferredOpen.promise.then(function () {
            $rootScope.$emit('modal:open', template, title, icon, scope, closeOnOverlayClick, showCloseButton);
        });
    }

    function close() {
        deferredClose.promise.then(function () {
            $rootScope.$emit('modal:close');
        });
    }

    function onOpen(callback, scope) {
        var handler = $rootScope.$on('modal:open', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredOpen.resolve();
    }

    function onClose(callback, scope) {
        var handler = $rootScope.$on('modal:close', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredClose.resolve();
    }
}
