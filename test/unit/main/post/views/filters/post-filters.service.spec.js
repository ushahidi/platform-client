describe('Post Filters Service', function () {

    var $rootScope,
        $scope,
        PostFilters,
        Notify;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.service('PostFilters', require('app/main/posts/views/post-filters.service.js'))
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
            PostFilters.setFilters({ tags : ['test']});
            var filters = PostFilters.getActiveFilters(PostFilters.getFilters());
            expect(filters.tags).toEqual(['test']);
        });

        it('should return status filter if different from defaults', function () {
            var filters = PostFilters.getActiveFilters({ status: ['draft'] });
            expect(filters.status).toEqual(['draft']);

            filters = PostFilters.getActiveFilters({ status: ['published', 'archived'] });
            expect(filters.status).toEqual(['published', 'archived']);

            filters = PostFilters.getActiveFilters({ status: ['published', 'draft'] });
            expect(filters.status).toEqual(undefined);
        });

        it('setFilters should not duplicate draft status', function () {
            var filters = PostFilters.setFilters({ status : ['draft']});
            expect(filters.status).toEqual(['draft']);
        });

        it('setFilters should override existing values with defaults', function () {
            PostFilters.setFilters({
                tags : ['test'],
                status : ['archived'],
                form: [1]
            });

            var filters = PostFilters.setFilters({
                status: ['archived', 'draft'],
                tags: [1,3,4],
                form: ['none']
            });
            expect(filters).toEqual({
                q: '',
                date_after: '',
                date_before: '',
                status: ['archived', 'draft'],
                has_location: 'all',
                published_to: '',
                center_point: '',
                within_km: '1',
                current_stage: [],
                tags: [1,3,4],
                form: ['none'],
                set: [],
                user: false
            });
        });

    });
});
