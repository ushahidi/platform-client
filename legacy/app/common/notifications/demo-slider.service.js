module.exports = DemoSliderService;

DemoSliderService.$inject = ['$rootScope', '$q', '$templateRequest'];
function DemoSliderService($rootScope, $q, $templateRequest) {
    var deferredOpen = $q.defer(),
        deferredClose = $q.defer();

    return {
        open: openTemplate,
        openTemplate: openTemplate,
        close: close,
        onOpen: onOpen,
        onClose: onClose
    };

    function openTemplate(template, icon, iconClass, scope, closeOnTimeout, showCloseButton, closeOnNavigate, loading, type) {
        deferredOpen.promise.then(function () {
            $rootScope.$emit('demoslider:open', template, icon, iconClass, scope, closeOnTimeout, showCloseButton, closeOnNavigate, loading, type);
            $rootScope.toggleModalVisible(true, true);
        });
    }

    function close() {
        $rootScope.toggleModalVisible(false, true);
        deferredClose.promise.then(function () {
            $rootScope.$emit('demoslider:close');
        });
    }

    function onOpen(callback, scope) {
        var handler = $rootScope.$on('demoslider:open', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredOpen.resolve();
    }

    function onClose(callback, scope) {
        var handler = $rootScope.$on('demoslider:close', callback);
        if (scope) {
            scope.$on('$destroy', handler);
        }
        deferredClose.resolve();
    }
}
