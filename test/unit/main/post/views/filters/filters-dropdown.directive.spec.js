describe('post active search filters directive', function () {

    var $rootScope,
        $scope,
        PostFilters,
        ModalService,
        SavedSearchEndpoint,
        element,
        isolateScope,
        FilterTransformers,
        $compile;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp.directive('postActiveSearchFilters', require('app/main/posts/views/filters/active-search-filters.directive'))
        .directive('filtersDropdown', require('app/main/posts/views/filters/filters-dropdown.directive'))
        .service('FilterTransformers', require('app/main/posts/views/filters/filter-transformers.service.js'))
        .service('PostFilters', require('app/main/posts/views/post-filters.service.js'))
        .service('$stateParams', function () {
            return {
                'view': 'data'
            };
        });
        angular.mock.module('testApp');
    });
    var defaults = {
        q: '',
        date_after: '',
        date_before: '',
        status: ['published', 'draft'],
        published_to: '',
        center_point: '',
        has_location: 'all',
        within_km: '1',
        current_stage: [],
        tags: [],
        saved_search: '',
        orderby: 'created',
        order: 'desc',
        order_unlocked_on_top: 'true',
        form: [1, 2, 3, 4],
        set: [],
        user: false,
        source: ['sms', 'twitter','web', 'email']
    };
    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _ModalService_, _PostFilters_, _SavedSearchEndpoint_, _FilterTransformers_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        SavedSearchEndpoint = _SavedSearchEndpoint_;
        PostFilters = _PostFilters_;
        ModalService = _ModalService_;
        FilterTransformers = _FilterTransformers_;
        $scope.filters = defaults;
        $scope.status = {
            isopen: false
        };
        element = '<filters-dropdown dropdown-status="status" filters-var="filters" ng-model="$scope.filters"></filters-dropdown>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();

    }));

    describe('test directive functions', function () {
        it('reactiveFilters should be false', function () {
            expect(PostFilters.reactiveFilters).toEqual(false);
        });
        it('should enable reactiveFilters when I call applyFiltersLocked', function () {
            expect(PostFilters.reactiveFilters).toEqual(false);
            isolateScope.applyFiltersLocked();
            expect(PostFilters.reactiveFilters).toEqual(true);
        });
        it('should clear PostFilters when calling clearFilters', function () {
            isolateScope.clearFilters();
            expect(isolateScope.filters).toEqual(PostFilters.getDefaults());
        });
        it('should set qEnabled true when I call enableQuery', function () {
            isolateScope.enableQuery();
            expect(PostFilters.qEnabled).toEqual(true);
        });
        it('should call saved-search-modal once when I call saveSavedSearchModal', function () {
            spyOn(ModalService, 'openTemplate');
            isolateScope.saveSavedSearchModal();
            expect(ModalService.openTemplate).toHaveBeenCalledTimes(1);
        });
    });
    describe('test children', function () {
        it('should have a filter-post-order-asc-desc directive child', function () {
            expect(element.find('filter-post-sorting-options').length).toEqual(1);
            expect(element.find('filter-post-order-asc-desc').length).toEqual(1);
            expect(element.find('filter-unlocked-on-top').length).toEqual(1);
            expect(element.find('filter-saved-search').length).toEqual(1);
            expect(element.find('filter-status').length).toEqual(1);
            expect(element.find('filter-category').length).toEqual(1);
            expect(element.find('filter-form').length).toEqual(1);
            expect(element.find('filter-source').length).toEqual(1);
            expect(element.find('filter-date').length).toEqual(1);
            expect(element.find('filter-location').length).toEqual(1);
        });
    });
});
