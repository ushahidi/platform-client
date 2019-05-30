describe('LoadingProgress', function () {

    var LoadingProgress, $rootScope;

    beforeEach(function () {
        makeTestApp()
        .service('LoadingProgress', require('app/common/services/loadingProgress.service.js'))
        .service('$transitions', function () {});
        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _LoadingProgress_, _$transitions_, _$injector_) {
        $rootScope = _$rootScope_;
        LoadingProgress = _LoadingProgress_;
    }));

    it('should return correct loading-state', function () {
        $rootScope.isLoading = true;
        expect(LoadingProgress.getLoadingState()).toBe(true);
        $rootScope.isLoading = false;
        expect(LoadingProgress.getLoadingState()).toBe(false);
    });
    it('should return correct saving-state', function () {
        $rootScope.isSaving = true;
        expect(LoadingProgress.getSavingState()).toBe(true);
        $rootScope.isSaving = false;
        expect(LoadingProgress.getSavingState()).toBe(false);
    });
    it('should update the loading-state', function () {
        LoadingProgress.setLoadingState(true);
        expect($rootScope.isLoading).toBe(true);
        LoadingProgress.setLoadingState(false);
        expect($rootScope.isLoading).toBe(false);
    });
    it('should update the saving-state', function () {
        LoadingProgress.setSavingState(true);
        expect($rootScope.isSaving).toBe(true);
        LoadingProgress.setSavingState(false);
        expect($rootScope.isSaving).toBe(false);
    });
});
