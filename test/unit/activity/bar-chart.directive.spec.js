var ROOT_PATH = '../../../';

describe('post view chart directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        PostEndpoint,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('activityBarChart', require(ROOT_PATH + 'app/activity/bar-chart.directive.js'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _PostEndpoint_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        PostEndpoint = _PostEndpoint_;
        spyOn(PostEndpoint, 'stats').and.callThrough();

        $scope.post = fixture.load('posts/120.json');
        $scope.filters = {};
        element = '<activity-bar-chart filters="filters"></activity-bar-chart>';

        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.data[0].values).toEqual([1,2,3,4,5]);
        expect(isolateScope.filters).toEqual({});
        expect(isolateScope.isLoading).toBe(false);
        expect(isolateScope.groupBy.value).toBe('tags');
        expect(isolateScope.groupByOptions.tags).toBe('nav.categories');
    });

    it('should have loaded posts', function () {
        expect(PostEndpoint.stats).toHaveBeenCalled();
    });

    it('should load reload posts when filters change', function () {
        isolateScope.filters.tags = 1;
        $rootScope.$digest();
        expect(PostEndpoint.stats).toHaveBeenCalledWith(jasmine.objectContaining({
            tags: 1
        }));
    });
});
