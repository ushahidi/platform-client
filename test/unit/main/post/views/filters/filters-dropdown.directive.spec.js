describe('post active search filters directive', function () {

    var $rootScope,
        $scope,
        PostFilters,
        ModalService,
        SavedSearchEndpoint,
        element,
        isolateScope,
        $compile;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('filtersDropdown', require('app/main/posts/views/filters/filters-dropdown.directive'))
            .service('PostFilters', require('app/main/posts/views/post-filters.service.js'))
            .value('$filter', function () {
                return function () {
                    return 'Feb 17, 2016';
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
    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _ModalService_, _PostFilters_, _SavedSearchEndpoint_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        SavedSearchEndpoint = _SavedSearchEndpoint_;
        PostFilters = _PostFilters_;
        ModalService = _ModalService_;
        $rootScope.filters = defaults;
        $scope.filters = defaults;
        element = '<filters-dropdown filters-var="$scope.filters" ng-model="$scope.filters"></filters-dropdown>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();

    }));

    describe('test directive functions', function () {
        it('reactiveFilters should be false', function () {
            expect(PostFilters.reactiveFilters).toEqual('disabled');
        });
        it('should enable reactiveFilters when I call applyFiltersLocked', function () {
            expect(PostFilters.reactiveFilters).toEqual('disabled');
            isolateScope.applyFiltersLocked();
            expect(PostFilters.reactiveFilters).toEqual('enabled');
        });
        it('should clear PostFilters when calling clearFilters', function () {
            isolateScope.clearFilters();
            expect(isolateScope.filtersVar).toEqual(PostFilters.getDefaults());
        });
        it('should set qEnabled true when I call enableQuery', function () {
            isolateScope.enableQuery();
            expect(PostFilters.qEnabled).toEqual(true);
        });
        it('should call saved-search-modal once when I call openSavedModal', function () {
            spyOn(ModalService, 'openTemplate');
            isolateScope.openSavedModal();
            expect(ModalService.openTemplate).toHaveBeenCalledTimes(1);
        });
    });
});
