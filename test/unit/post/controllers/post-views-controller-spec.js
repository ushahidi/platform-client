var ROOT_PATH = '../../../../';

describe('posts views controller', function () {

    var $rootScope,
        $scope,
        $controller,
        mockGlobalFilter = {
            getPostQuery: function () {
                return {
                    q : 'dummy'
                };
            },
            clearSelected: function () {}
        },
        mockedSessionData;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ]),
        mockedSessionService = {
            getSessionData: function () {
                return mockedSessionData;
            },
            getSessionDataEntry: function (key) {
                return mockedSessionData[key];
            },
            setSessionDataEntry: function (key, value) {
                mockedSessionData[key] = value;
            }
        };

        testApp.service('Session', function () {
            return mockedSessionService;
        })
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('postViewsController', require(ROOT_PATH + 'app/post/controllers/post-views-controller.js'));

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

        spyOn(mockGlobalFilter, 'clearSelected').and.callThrough();
        spyOn(mockGlobalFilter, 'getPostQuery').and.callThrough();

        $controller('postViewsController', {
            $scope: $scope,
            $routeParams: mockRouteParams,
            GlobalFilter: mockGlobalFilter
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

    it('should clear the GlobalFilter', function () {
        expect(mockGlobalFilter.clearSelected).toHaveBeenCalled();
    });

    it('should query the GlobalFilter', function () {
        expect(mockGlobalFilter.getPostQuery).toHaveBeenCalled();
    });

    it('should set the filters from GlobalFilter.getPostQuery() to $scope.filters', function () {
        expect($scope.filters).toEqual({ q : 'dummy' });
    });

});
