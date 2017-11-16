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
        })
        .service('$transition$', function () {
            return {
                'params': function () {
                    return {
                        'view': 'list'
                    };
                },
                to: function () {
                    return {
                        name : ''
                    };
                }
            };
        })
        .service('$state', function () {
            return {
                'go': function () {
                    return {};
                }
            };
        });
        angular.mock.module('testApp');

        spyOn(mockPostFilters, 'getFilters').and.callThrough();

        inject((_$rootScope_, _$controller_) => {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = _$rootScope_.$new();
            $scope.$resolve = {
                collection: {
                    allowed_privileges: 'update'
                }
            };
            $controller('postViewsController', {
                $scope: $scope
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
