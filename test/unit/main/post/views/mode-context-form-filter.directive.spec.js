describe('mode-context-form-filter directive', function () {
    var $rootScope,
        $scope,
        element,
        isolateScope,
        PostEndpoint,
        FormEndpoint,
        TagEndpoint,
        $location,
        PostSurveyService,
        PostFilters;
    beforeEach(function () {
        var testApp;
        fixture.setBase('mocked_backend/api/v3');
        testApp = makeTestApp();
        testApp.directive('modeContextFormFilter', require('app/main/posts/views/mode-context-form-filter.directive.js'));
        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, $compile, _FormEndpoint_, _PostEndpoint_, _TagEndpoint_, _PostSurveyService_, _PostFilters_, _$location_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        PostEndpoint = _PostEndpoint_;
        FormEndpoint = _FormEndpoint_;
        TagEndpoint = _TagEndpoint_;
        PostSurveyService = _PostSurveyService_;
        PostFilters = _PostFilters_;
        $location = _$location_;
        spyOn(FormEndpoint, 'query').and.callThrough();
        spyOn(TagEndpoint, 'query').and.callThrough();
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
            expect(FormEndpoint.query).toHaveBeenCalled();
        });
        it('should fetch tags from endpoint', function () {
            expect(TagEndpoint.query).toHaveBeenCalled();
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
        it('should change form if a category is selected on a new form', function () {
            isolateScope.forms = [{id: 1}, {id: 2}];
            isolateScope.filters.tags = [1,2];
            isolateScope.changeForms();
            expect(isolateScope.filters.tags).toEqual([]);
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
        it('should return the correct formatting for unmapped posts', function () {
            isolateScope.unmapped = 1;
            expect(isolateScope.getUnmapped()).toEqual('1 post');
            isolateScope.unmapped = 2;
            expect(isolateScope.getUnmapped()).toEqual('2 posts');
        });
        it('should hide forms that are not selected', function () {
            isolateScope.hide(2);
            expect(isolateScope.filters.form.indexOf(2)).toEqual(-1);
        });
    });
});
