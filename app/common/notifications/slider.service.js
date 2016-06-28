module.exports = SliderService;

SliderService.$inject = ['$rootScope', '$q', '$templateRequest'];
function SliderService($rootScope, $q, $templateRequest) {
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

    function openUrl(templateUrl, icon, iconClass, scope, closeOnTimeout, showCloseButton) {
        deferredOpen.promise.then(function () {
            // Load template
            $templateRequest(templateUrl).then(function (template) {
                $rootScope.$emit('slider:open', template, icon, iconClass, scope, closeOnTimeout, showCloseButton);
            });
        });
    }

    function openTemplate(template, icon, iconClass, scope, closeOnTimeout, showCloseButton) {
        deferredOpen.promise.then(function () {
            $rootScope.$emit('slider:open', template, icon, iconClass, scope, closeOnTimeout, showCloseButton);
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
