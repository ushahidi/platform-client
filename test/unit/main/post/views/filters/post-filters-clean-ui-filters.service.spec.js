describe('filters with saved search', function () {

    var
        PostFilters,
        Notify;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.service('PostFilters', require('app/main/posts/views/post-filters.service.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_Notify_, _PostFilters_) {
        /**
         * inject deps
         */
        Notify = _Notify_;
        PostFilters = _PostFilters_;
    }));
    describe('PostFilters.cleanUIFilters ', function () {
        it('returns an empty object when I send a set of "target" filters equal to the "from" filters', function () {
            var from = {
                'status': [
                    'archived'
                ],
                'tags': [
                    32,
                    46,
                    45
                ],
                'order': 'asc'
            };
            var target = {
                'status': [
                    'archived'
                ],
                'tags': [
                    32,
                    46,
                    45
                ],
                'order': 'asc'
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({});
        });
        it ('returns status filters correctly', function () {
            var target = {
                status: ['draft']
            };
            var from = {
                status: []
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({status: ['draft']});
            target = {
                status: ['draft', 'archive']
            };
            from = {
                status: ['draft', 'archive']
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({});
            target = {
                status: ['draft', 'archive']
            };
            from = {
                status: ['draft']
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({status: ['archive']});
        });
        it ('returns tags(categories) filters correctly', function () {
            var target = {
                tags: [1, 2]
            };
            var from = {
                tags: []
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({tags: [1, 2]});
            target = {
                tags: [1, 2]
            };
            from = {
                tags: [1, 2]
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({});
            target = {
                tags: [1, 2]
            };
            from = {
                tags: [1]
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({tags: [2]});
        });
        it ('returns  source filters correctly', function () {
            var target = {
                source: ['web', 'sms']
            };
            var from = {
                source: []
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({source: ['web', 'sms']});
            target = {
                source: ['web', 'sms']
            };
            from = {
                source: ['web', 'sms']
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({});
            target = {
                source: ['web', 'sms']
            };
            from = {
                source: ['web']
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({source: ['sms']});
        });
        it ('returns form (survey) filters correctly', function () {
            var target = {
                form: [1, 22]
            };
            var from = {
                form: []
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({form: [1, 22]});
            target = {
                source: [1, 22]
            };
            from = {
                source: [1, 22]
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({});
            target = {
                source: [1, 22]
            };
            from = {
                source: [22]
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({source: [1]});
        });
        it ('returns non array filters correctly', function () {
            var target = {
                q: '',
                date_after: '',
                date_before: '',
                published_to: '',
                center_point: '',
                has_location: 'all',
                within_km: '1',
                orderby: 'created',
                order: 'desc',
                order_unlocked_on_top: 'true'
            };
            var from = {
                q: '',
                date_after: '',
                date_before: '',
                published_to: '',
                center_point: '',
                has_location: 'all',
                within_km: '1',
                orderby: 'created',
                order: 'desc',
                order_unlocked_on_top: 'true'
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({});
            target.q = 'romina';
            PostFilters.cleanUIFilters();
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({q: 'romina'});
        });
    });
});
