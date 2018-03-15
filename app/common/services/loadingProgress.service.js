module.exports = LoadingProgress;

LoadingProgress.$inject = ['$rootScope', '$transitions', '$injector'];
function LoadingProgress($rootScope, $transitions, $injector) {
    function watchTransitions() {
        $transitions.onStart({}, function (transition) {
            $rootScope.isLoading = true;
            if (transition.from().name === 'list.data.edit') {
                $rootScope.isSaving = true;
            }
        });

        $transitions.onExit({}, function (transition) {
            var $httpProvider = $injector.get('$http');
            if ($httpProvider.pendingRequests.length === 0) {
                $rootScope.isLoading = false;
                $rootScope.isSaving = false;
            }
        });
    }

    function getLoadingState() {
        return $rootScope.isLoading;
    }

    function getSavingState() {
        return $rootScope.isSaving;
    }

    function setLoadingState(newState) {
        $rootScope.isLoading = newState;
    }

    function setSavingState(newState) {
        $rootScope.isSaving = newState;
    }

    return {
        watchTransitions: watchTransitions,
        getLoadingState: getLoadingState,
        getSavingState: getSavingState,
        setLoadingState: setLoadingState,
        setSavingState: setSavingState
    };
}
