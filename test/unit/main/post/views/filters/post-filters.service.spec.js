describe('Post Filters Service', function () {

    var $rootScope,
        $scope,
        PostFilters,
        Notify;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.service('PostFiltersService', require('app/main/posts/views/post-filters.service.js'))
        .value('$filter', function () {
            return function () {
                return 'Feb 17, 2016';
            };
        });

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _PostFilters_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        PostFilters = _PostFilters_;
        Notify = _Notify_;
    }));

    describe('test service functions', function () {

        it('should return the active filters when an array filter differs from the default', function () {
            PostFilters.filterState.tags.push('test');
            var filters = PostFilters.getActiveFilters(PostFilters.getFilters());
            expect(filters.tags.length).toEqual(1);
        });

    });
});
