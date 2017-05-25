describe('post view list directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        PostFilters,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = makeTestApp();

        testApp.directive('postViewList', require('app/main/posts/views/post-view-list.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})
        .value('moment', require('moment'))
        .service('PostEndpoint', function () {
            return {
                query: function (params) {
                    var data;
                    if (params.offset === 20) {
                        data = {
                            results : [
                                { id: 1, post_date: '2016-01-03'},
                                { id: 2, post_date: '2016-02-03'},
                                { id: 3, post_date: '2016-03-03'}
                            ]
                        };
                    } else {
                        data = {
                            results : [
                                { id: 10, post_date: '2016-03-03', 'allowed_privileges': ['update']},
                                { id: 11, post_date: '2016-03-04'}
                            ]
                        };
                    }

                    return {
                        '$promise' : {
                            then: function (cb) {
                                cb(data);
                            }
                        }
                    };
                }
            };
        });

        // Mock current date
        jasmine.clock().mockDate(new Date(2016, 9, 4));

        angular.mock.module('testApp');
    });

    afterEach(function () {
        // Restore clock, otherwise test timing breaks
        jasmine.clock().mockDate();
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _PostFilters_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        PostFilters = _PostFilters_;
        $scope.isLoading = {
            state: true
        };
        $scope.filters = {};
        element = '<post-view-list filters="filters" is-loading="isLoading"></post-view-list>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.currentPage).toEqual(1);
    });

    it('should check if the user has bulk action permissions', function () {
        var result = isolateScope.userHasBulkActionPermissions();
        expect(result).toBe(true);
    });

    it('should check if filters have been set', function () {
        spyOn(PostFilters, 'hasFilters').and.returnValue(false);

        isolateScope.filters = {
            status: 'all'
        };

        var result = isolateScope.hasFilters();

        expect(result).toBe(false);
        expect(PostFilters.hasFilters).toHaveBeenCalledWith({ status: 'all' });
    });

    it('should delete selected posts', function () {
        spyOn(Notify, 'confirmDelete').and.callThrough();
        isolateScope.posts[0].id = 'pass';
        isolateScope.selectedPosts.push = 'pass';

        isolateScope.deletePosts();

        $rootScope.$digest();
        expect(Notify.confirmDelete).toHaveBeenCalled();
    });

    it('should append new posts to groups', function () {
        expect(isolateScope.groupedPosts['7 months ago'].length).toEqual(2);
        expect(isolateScope.groupedPosts['8 months ago']).toBeUndefined();
        expect(isolateScope.groupedPosts['9 months ago']).toBeUndefined();
        expect(isolateScope.posts.length).toEqual(2);

        isolateScope.loadMore();

        expect(isolateScope.groupedPosts['7 months ago'].length).toEqual(3);
        expect(isolateScope.groupedPosts['8 months ago'].length).toEqual(1);
        expect(isolateScope.groupedPosts['9 months ago'].length).toEqual(1);
        expect(isolateScope.posts.length).toEqual(5);
    });
});
