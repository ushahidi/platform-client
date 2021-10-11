describe('mode-context-form-filter directive', function () {
    var $rootScope,
        $scope,
        element,
        isolateScope,
        PostEndpoint,
        $location,
        PostSurveyService,
        PostFilters,
        SurveysSdk;
    beforeEach(function () {
        var testApp;
        fixture.setBase('mocked_backend/api/v3');
        testApp = makeTestApp();
        testApp.directive('modeContextFormFilter', require('app/map/mode-context/mode-context-form-filter.directive.js'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, $compile, _PostEndpoint_, _PostSurveyService_, _PostFilters_, _$location_, _SurveysSdk_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        PostEndpoint = _PostEndpoint_;
        PostSurveyService = _PostSurveyService_;
        PostFilters = _PostFilters_;
        $location = _$location_;
        SurveysSdk = _SurveysSdk_;
        spyOn(SurveysSdk, 'getSurveysTo').and.callThrough();
        spyOn(PostEndpoint, 'stats').and.callThrough();
        spyOn(PostFilters, 'getQueryParams').and.callThrough();

        $scope.filters = PostFilters.getDefaults();

        element = '<mode-context-form-filter></mode-context-form-filter>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.scope();
        // isolateScope.filters = {q: '', created_after: '', created_before: '', status: 'published', published_to: '', center_point: '', within_km: '1', current_stage: [], tags: [], form: [1,2], set: []};
    }));
    describe('test directive-functions', function () {
        it('should fetch forms from endpoint', function () {
            expect(SurveysSdk.getSurveysTo).toHaveBeenCalled();
        });
        it('should fetch queryParams from service', function () {
            expect(PostFilters.getQueryParams).toHaveBeenCalled();
        });
        it('should fetch post-stats from endpoint', function () {
            expect(PostEndpoint.stats).toHaveBeenCalled();
        });
        it('should change the value of forms if filters are changed', function () {
            spyOn(PostFilters, 'getFilters');
            expect(PostFilters.getFilters).not.toHaveBeenCalled();
            isolateScope.filters.status = 'archived';
            $scope.$digest();
            expect(PostFilters.getFilters).toHaveBeenCalled();
        });
        it('should change value of languageToggle on toggle', function () {
            expect(isolateScope.showLanguage).toEqual(false);
            isolateScope.languageToggle();
            expect(isolateScope.showLanguage).toEqual(true);
        });
        it('should change filters when selecting show only', function () {
            isolateScope.showOnly(2);
            expect(isolateScope.filters.form.length).toEqual(1);
            expect(isolateScope.filters.form[0]).toEqual(2);
        });
        it('should redirect to data-view', function () {
            $location.path('/views/map');
            isolateScope.goToUnmapped();
            expect($location.path()).toEqual('/views/data');
        });
        it('should hide forms that are not selected', function () {
            isolateScope.hide(2);
            expect(isolateScope.filters.form.indexOf(2)).toEqual(-1);
        });
    });
});
