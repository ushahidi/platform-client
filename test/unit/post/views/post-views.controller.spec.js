var ROOT_PATH = '../../../../';

describe('posts views controller', function () {

    var $rootScope,
        $scope,
        $controller,
        mockPostFilters = {
            getFilters: function () {
                return {
                    q : 'dummy'
                };
            }
        };

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'pascalprecht.translate'
        ]);

        testApp
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('postViewsController', require(ROOT_PATH + 'app/post/views/post-views.controller.js'))
        .service('PostFilters', function () {
            return mockPostFilters;
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));


    beforeEach(function () {
        var mockRouteParams = {
            view : 'list'
        };

        spyOn(mockPostFilters, 'getFilters').and.callThrough();

        $controller('postViewsController', {
            $scope: $scope,
            $routeParams: mockRouteParams
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should have the right title', function () {
        expect($scope.title).toBe('Posts');
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
