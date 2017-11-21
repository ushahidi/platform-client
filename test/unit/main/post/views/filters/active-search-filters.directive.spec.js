describe('post active search filters directive', function () {

    var $rootScope,
        $scope,
        directiveScope,
        PostFilters,
        Notify,
        SavedSearchEndpoint,
        element,
        $compile;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postActiveSearchFilters', require('app/main/posts/views/filters/active-search-filters.directive'))
        .service('FilterTransformers', require('app/main/posts/views/filters/filter-transformers.service.js'))
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
    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _PostFilters_, _SavedSearchEndpoint_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        SavedSearchEndpoint = _SavedSearchEndpoint_;
        PostFilters = _PostFilters_;
        Notify = _Notify_;
        $rootScope.filters = defaults;
        $scope.filters = defaults;
        element = '<post-active-search-filters ng-model="$scope.filters"></post-active-search-filters>';
        element = $compile(element)($scope);
        $scope.$digest();
        directiveScope = element.scope();
    }));

    describe('test directive functions', function () {
        it('should execute the set of transformers and return the correct values for each', function () {
            var transformers = ['tags', 'center_point', 'created_before', 'created_after', 'fake'];
            var result = '';

            _.each(transformers, function (transformer) {

                if (_.contains(['tags'], transformer)) {

                    result = directiveScope.transformFilterValue('test', transformer);
                    expect(result).toEqual('test');

                } else if (_.contains(['created_before', 'created_after'], transformer)) {

                    result = directiveScope.transformFilterValue('2016-02-17T18:06:46+00:00', transformer);
                    expect(result).toEqual('Feb 17, 2016');

                } else if (transformer === 'center_point') {
                    result = directiveScope.transformFilterValue('test', transformer);
                    // should be tested via e2e tests
                } else {
                    result = directiveScope.transformFilterValue('test', transformer);
                    expect(result).toEqual('test');
                }
            });
        });

        it('should remove a given filter from the PostFilters object', function () {
            spyOn(PostFilters, 'clearFilter');
            var mockEvent = {
                type: 'click',
                stopPropagation: function () {},
                preventDefault: function () {}
            };
            directiveScope.removeFilter('test', 'test', false, mockEvent);

            expect(PostFilters.clearFilter).toHaveBeenCalled();
        });
    });
    describe('test clean filters', function () {
        it ('should show the clean active search filters, which are different from their default value', function () {
            spyOn(PostFilters, 'getActiveFilters').and.callThrough();
            spyOn(PostFilters, 'getCleanActiveFilters').and.callThrough();
            var elementDir = '<post-active-search-filters ng-model="$scope.filters"></post-active-search-filters>';
            elementDir = $compile(elementDir)($scope);
            var directiveScopeTest = elementDir.scope();
            var newDefaults = defaults;
            newDefaults.source = ['sms'];
            PostFilters.setFilters(newDefaults);
            $scope.$digest();
            expect(PostFilters.getCleanActiveFilters).toHaveBeenCalled();
            expect(directiveScopeTest.activeFilters).toEqual({source: ['sms'], form: [1,2,3,4]});
        });
    });
});
