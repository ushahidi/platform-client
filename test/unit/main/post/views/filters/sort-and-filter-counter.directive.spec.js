describe('filter unlocked on top directive', function () {

    var
        $scope,
        element,
        $rootScope,
        isolateScope,
        PostFilters;
    var defaultFilters = {
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
        form: [],
        set: [],
        user: false,
        source: ['sms', 'twitter','web', 'email']
    };
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();
        testApp.directive('sortAndFilterCounter', require('app/main/posts/views/filters/sort-and-filter-counter.directive'))
            .service('PostFilters', require('app/main/posts/views/post-filters.service.js'));
        angular.mock.module('testApp');
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _PostFilters_) {
        $rootScope = _$rootScope_;
        PostFilters = _PostFilters_;
        $scope = $rootScope.$new();
        PostFilters.setFilters(defaultFilters);
        // $scope.models = {};
        // $scope.models.modelUnlocked = 'true';
        element = '<sort-and-filter-counter></sort-and-filter-counter>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('filtersCount value', function () {
        it('should be 0 when we initialize the directive with default filters', function () {
            expect(isolateScope.filtersCount).toEqual(0);
        });
        it('should be 1 when we change a filter to a non default value', function () {
            defaultFilters.order_unlocked_on_top = 'false';
            PostFilters.setFilters(defaultFilters);
            $scope.$digest();
            /**
             * Checks that no other filters changed because of changing order_unlocked_on_top
             */
            expect(isolateScope.filtersCount).toEqual(1);

        });
        it('should be 0 when we change a filter back to the default value', function () {
            defaultFilters.order_unlocked_on_top = 'true';
            PostFilters.setFilters(defaultFilters);
            $scope.$digest();
            /**
             * Checks that no other filters changed because of changing order_unlocked_on_top
             */
            expect(isolateScope.filtersCount).toEqual(0);
        });
    });
});
