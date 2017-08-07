describe('posts views controller', function () {
    var $rootScope,
        $scope,
        $controller,
        mockPostFilters = {
            getFilters: function () {
                return {
                    q : 'dummy'
                };
            },
            setMode: function () {
            }
        };

    beforeEach(function (done) {
        var testApp = makeTestApp();
        testApp
        .controller('postViewsController', require('app/main/posts/views/post-views.controller.js'))
        .service('PostFilters', function () {
            return mockPostFilters;
        });

        angular.mock.module('testApp');

        var mockRouteParams = {
            view : 'list'
        };

        spyOn(mockPostFilters, 'getFilters').and.callThrough();

        inject((_$rootScope_, _$controller_) => {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = _$rootScope_.$new();

            $controller('postViewsController', {
                $scope: $scope,
                $routeParams: mockRouteParams
            });

            $rootScope.$digest();
            $rootScope.$apply();

            done();
        });
    });

    it('should have the right title', function () {
        expect($scope.title).toBe('post.posts');
    });

    it('should set the current view', function () {
        expect($scope.currentView).toBe('list');
    });

    it('should get the PostFilters', function () {
        expect(mockPostFilters.getFilters).toHaveBeenCalled();
    });

    it('should set the filters from PostFilters.getFilters() to $scope.filters', function () {
        expect($scope.filters).toEqual({ q : 'dummy' });
    });

});
