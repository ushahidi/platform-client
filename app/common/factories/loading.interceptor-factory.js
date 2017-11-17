module.exports = LoadingInterceptor;

LoadingInterceptor.$inject = ['LoadingProgress', '$q', '$injector'];

function LoadingInterceptor(LoadingProgress, $q, $injector) {
    /* an interceptor that triggers loading-state in the beginning of
    * a http-request and remove it when all requests are done */

    return {
        request: function (config) {
            if (LoadingProgress.getLoadingState() !== true) {
                LoadingProgress.setLoadingState(true);
            }
            // we want this to trigger isSaving everytime except when a lock-updates
            if (config.method === 'PUT' && config.url.indexOf('lock') === -1) {
                LoadingProgress.setSavingState(true);
            }
            return config;
        },
        response: function (response) {
            var httpService = $injector.get('$http');
            if (httpService.pendingRequests.length === 0) {
                LoadingProgress.setLoadingState(false);
                LoadingProgress.setSavingState(false);
            }
            return response || $q.when(response);
        }
    };
}
