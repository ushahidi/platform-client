module.exports = LoadingProgress;

LoadingProgress.$inject = ['$rootScope', '$transitions'];
function LoadingProgress($rootScope, $transitions) {
    function watchTransitions() {
        $transitions.onStart({}, function (transition) {
            $rootScope.loading = {isLoading: true, isSaving: false};
            if (transition.from().name === 'list.data.edit') {
                $rootScope.loading.isSaving = true;
            }
        });

        $transitions.onFinish({}, function (transition) {
            $rootScope.loading = {isLoading: false, isSaving: false};
        });
    }

    function getLoadingState() {
        return $rootScope.loading;
    }

    function setLoadingState(newState) {
        $rootScope.loading = newState;
    }

    function subscribeOnLoadingState(callback) {
        $rootScope.$watch('loading', callback);
    }

    return {
        watchTransitions: watchTransitions,
        getLoadingState: getLoadingState,
        setLoadingState: setLoadingState,
        subscribeOnLoadingState: subscribeOnLoadingState
    };
}
