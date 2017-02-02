module.exports = SliderService;

SliderService.$inject = ['$rootScope', '$q', '$templateRequest'];
function SliderService($rootScope, $q, $templateRequest) {
    var deferredOpen = $q.defer(),
        deferredClose = $q.defer();

    return {
        open: openTemplate,
        openTemplate: openTemplate,
        close: close,
        onOpen: onOpen,
        onClose: onClose
    };

    function openTemplate(template, icon, iconClass, scope, closeOnTimeout, showCloseButton, closeOnNavigate) {
        deferredOpen.promise.then(function () {
            $rootScope.$emit('slider:open', template, icon, iconClass, scope, closeOnTimeout, showCloseButton, closeOnNavigate);
        });
    }

    function close() {
        deferredClose.promise.then(function () {
            $rootScope.$emit('slider:close');
        });
    }

    function onOpen(callback, scope) {
        var handler = $rootScope.$on('slider:open', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredOpen.resolve();
    }

    function onClose(callback, scope) {
        var handler = $rootScope.$on('slider:close', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredClose.resolve();
    }
}
