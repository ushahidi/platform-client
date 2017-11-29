describe('filter post sorting options on top directive', function () {

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
        testApp.directive('filterPostSortingOptions', require('app/main/posts/views/filters/filter-post-sorting-options.directive'))
            .service('PostFilters', require('app/main/posts/views/post-filters.service.js'));
        angular.mock.module('testApp');
    });
    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _PostFilters_) {
        $rootScope = _$rootScope_;
        PostFilters = _PostFilters_;
        $scope = $rootScope.$new();
        $scope.filters = defaultFilters;
        element = '<filter-post-sorting-options ng-model="filters.orderby"></filter-post-sorting-options>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('test orderby values', function () {
        it('should be 0 when we initialize the directive with default filters', function () {
            expect(isolateScope.orderValue.value).toEqual('created');
        });
        it('$scope.filters and cleanActive filters should change when orderby changes', function () {
            isolateScope.orderValue.value = 'updated';
            $rootScope.$digest();
            /**
             * Checks that orderby (which we send as ngModel) was updated on setViewValue
             * this is pretty much all this directive does.
             */
            expect($scope.filters.orderby).toEqual('updated');
            /**
             * Checks that no other filters changed because of changing orderby
             */
            expect(PostFilters.getCleanActiveFilters($scope.filters)).toEqual({orderby: 'updated'});
        });
    });
});
