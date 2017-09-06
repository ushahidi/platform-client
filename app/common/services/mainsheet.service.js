module.exports = MainsheetService;

MainsheetService.$inject = ['$rootScope', '$q'];

function MainsheetService($rootScope, $q) {
    var deferredOpen = $q.defer(),
        deferredClose = $q.defer(),
        isOpen = false;

    return {
        open: openTemplate,
        openTemplate: openTemplate,
        close: closeTemplate,
        closeTemplate: closeTemplate,
        getState: getState,
        onOpen: onOpen,
        onClose: onClose,
        setState: setState
    };

    function openTemplate(template, title, scope) {
        deferredOpen.promise.then(function () {
            $rootScope.$emit('mainsheet:open', template, title, scope);
        });
    }

    function closeTemplate() {
        deferredClose.promise.then(function () {
            $rootScope.$emit('mainsheet:close');
        });
    }

    function getState() {
        return isOpen;
    }

    function onOpen(callback, scope) {
        var handler = $rootScope.$on('mainsheet:open', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredOpen.resolve();
    }

    function onClose(callback, scope) {
        var handler = $rootScope.$on('mainsheet:close', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredClose.resolve();
    }

    function setState(open) {
        $rootScope.$emit('mainsheet:statechange');
        isOpen = open;
    }
}
