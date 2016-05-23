module.exports = ModalService;

ModalService.$inject = ['$rootScope', '$q'];
function ModalService($rootScope, $q) {
    var deferredOpen = $q.defer(),
        deferredClose = $q.defer();

    return {
        open: open,
        close: close,
        onOpen: onOpen,
        onClose: onClose
    };

    function open(templateUrl, title, closeOnOverlayClick, showCloseButton) {
        deferredOpen.promise.then(function () {
            $rootScope.$emit('modal:open', templateUrl, title, closeOnOverlayClick, showCloseButton);
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
