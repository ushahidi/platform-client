describe('filters with saved search', function () {

    var $rootScope,
        $scope,
        directiveScope,
        PostFilters,
        Notify,
        element,
        $compile;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.directive('postActiveSearchFilters', require('app/main/posts/views/filters/active-search-filters.directive'))
        .service('FilterTransformers', require('app/main/posts/views/filters/filter-transformers.service.js'))
        .service('PostFilters', require('app/main/posts/views/post-filters.service.js'));

        angular.mock.module('testApp');
    });
    var savedSearch = {
        'id': 56,
        'url': null,
        'user': {
            'id': 17,
            'url': 'http://192.168.33.110/api/v3/users/17'
        },
        'filter': {
            'status': [
                'archived'
            ],
            'tags': [
                32,
                46,
                45
            ],
            'order': 'asc'
        },
        'name': 'saved searcmh testing!!!!!us',
        'description': 'statuses33',
        'view': 'data',
        'view_options': null,
        'role': null,
        'featured': false,
        'created': '2017-11-10T15:58:55+00:00',
        'updated': '2017-11-21T01:08:48+00:00',
        'allowed_privileges': [
            'read',
            'create',
            'update',
            'delete',
            'search'
        ]
    };
    beforeEach(angular.mock.inject(function (_$rootScope_, _$compile_, _Notify_, _PostFilters_) {
        /**
         * inject deps
         */
        Notify = _Notify_;
        PostFilters = _PostFilters_;
        /**
         * create directive
         */
        // $compile = _$compile_;
        // $rootScope = _$rootScope_;
        // $scope = _$rootScope_.$new();
        // element = '<post-active-search-filters ng-model="filters" filters-var="filters"></post-active-search-filters>';
        // element = $compile(element)($scope);
        // directiveScope = element.scope();
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
        it ('returns status filters when "from" does not have them but "target" does', function () {
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
                status: ['draft']
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({status: ['archive']});
        });
        it ('returns tags filters when "from" does not have them but "target" does', function () {
            var target = {
                tags: [1, 2]
            };
            var from = {
                tags: [1]
            };
            expect(PostFilters.cleanUIFilters(target, from)).toEqual({tags: [2]});
        });

    });

    /*describe('activeFilters scope ', function () {
        it('should be empty when I set a savedSearch', function () {
            PostFilters.setFilters(savedSearch.filter);
            $scope.$digest();
            PostFilters.setMode('savedsearch', savedSearch);
            $scope.$digest();
            console.log(PostFilters.getUIActiveFilters(directiveScope.uiFilters));
            expect(PostFilters.getUIActiveFilters(directiveScope.uiFilters)).toEqual({});
        });
        it('should have a savedSearch after I set it', function () {
            PostFilters.setMode('savedsearch', savedSearch);
            $scope.$digest();
            expect(directiveScope.savedSearch.filter).toEqual(savedSearch.filter);
            expect(PostFilters.getFilters().status).toEqual(['archived']);
            console.log(PostFilters.getFilters().tags);
            expect(PostFilters.getFilters().tags).toEqual([
                32,
                46,
                45
            ]);
        });

        it('should handle extra status filters (outside of savedSearch) ', function () {
            PostFilters.setFilters(savedSearch.filter);
            PostFilters.setMode('savedsearch', savedSearch);
            // PostFilters.setFilters(savedSearch.filter);
            PostFilters.setFilter('status', ['draft']);
            $scope.$digest();
            expect(directiveScope.uiFilters).toEqual({status: ['draft']});
            //removing status filter outside the saved search works
            PostFilters.clearFilter('status', ['draft']);
            $scope.$digest();
            expect(directiveScope.uiFilters).toEqual({});
            console.log(PostFilters.getFilters());
            PostFilters.clearFilter('status', ['archived']);
            $scope.$digest();
            expect(directiveScope.uiFilters).toEqual({}); // <-- this fails because published is there, but why?
            console.log(directiveScope.uiFilters, directiveScope.savedSearch.filter);
            expect(directiveScope.savedSearch.filter.status).toBeUndefined();
        });

        it('should handle extra status filters (outside of savedSearch) ', function () {
            PostFilters.setFilters(savedSearch.filter);
            PostFilters.setMode('savedsearch', savedSearch);
            // PostFilters.setFilters(savedSearch.filter);
            PostFilters.setFilter('status', ['draft']);
            $scope.$digest();
            expect(directiveScope.uiFilters).toEqual({status: ['draft']});
            //removing status filter outside the saved search works
            PostFilters.clearFilter('status', ['draft']);
            $scope.$digest();
            expect(directiveScope.uiFilters).toEqual({});
            PostFilters.clearFilter('status', ['archived']);
            $scope.$digest();
            expect(directiveScope.uiFilters).toEqual({}); // <-- this fails because published is there, but why?
            console.log(directiveScope.uiFilters, directiveScope.savedSearch.filter);
            expect(directiveScope.savedSearch.filter.status).toBeUndefined();
        });

    });*/
});
