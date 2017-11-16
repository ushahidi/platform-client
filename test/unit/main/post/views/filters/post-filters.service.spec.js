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
        it('getCleanActiveFilters should return only the difference between the default filters and the currently set filters', function () {
            PostFilters.setFilters({ tags : ['test']});
            var filters = PostFilters.getCleanActiveFilters(PostFilters.getFilters());
            expect(filters).toEqual({tags: ['test']});
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
                user: false,
                source: ['sms', 'twitter', 'web', 'email'],
                saved_search: '',
                orderby: 'created',
                order: 'desc',
                order_unlocked_on_top: 'true'
            });
        });
        it ('if filter is represented of an array, only selected filter-value should be removed', function () {
            PostFilters.setFilters({
                status: ['archived', 'draft'],
                tags: [1,3,4],
                source: ['sms', 'twitter', 'web', 'email'],
                form: ['testForm1', 'testForm2', 'testForm3']
            });

            PostFilters.clearFilter('status', 'archived');
            PostFilters.clearFilter('tags', 4);
            PostFilters.clearFilter('source', 'twitter');
            PostFilters.clearFilter('form', 'testForm1');
            var filters = PostFilters.getFilters();
            expect(filters.status).toEqual(['draft']);
            expect(filters.tags).toEqual([1, 3]);
            expect(filters.source).toEqual(['sms', 'web', 'email']);
            expect(filters.form).toEqual(['testForm2', 'testForm3']);
        });
        it('if filter is represented by an array, and all filter-values for that filters are removed, the filter should reset to default', function () {
            var newFilters = {
                status: ['archived', 'draft'],
                tags: [1,3,4],
                source: ['sms', 'twitter', 'web', 'email'],
                form: ['testForm1', 'testForm2', 'testForm3']
            };
            PostFilters.setFilters(newFilters);

            _.each(newFilters, function (values, filterKey) {
                _.each(newFilters[filterKey], function (filterValue) {
                    PostFilters.clearFilter(filterKey, filterValue);
                });
            });
            var filters = PostFilters.getFilters();
            expect(filters).toEqual(PostFilters.getDefaults());
        });
        it ('if filter is not represented by an array, the selected filter should be reset to default ', function () {
            var defaultFilters = PostFilters.getDefaults();

            PostFilters.setFilters({
                date_before: 'Feb 17, 2016',
                within_km: '5',
                order_unlocked_on_top: false
            });

            PostFilters.clearFilter('date_before', 'Feb 17, 2016');
            PostFilters.clearFilter('within_km', 5);
            PostFilters.clearFilter('order_unlocked_on_top', false);

            var filters = PostFilters.getFilters();
            expect(filters.date_before).toEqual(defaultFilters.date_before);
            expect(filters.within_km).toEqual(defaultFilters.within_km);
            expect(filters.order_unlocked_on_top).toEqual(defaultFilters.order_unlocked_on_top);
        });
    });
});
