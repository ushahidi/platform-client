var ROOT_PATH = '../../../../../';

describe('post view chart directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postViewChart', require(ROOT_PATH + 'app/post/directives/views/post-view-chart-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');

        element = '<post-view-chart></post-view-chart>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should ', function () {
        // This directive is better tested via e2e
        expect(isolateScope.data[0].values).toEqual([1,2,3,4,5]);

    });
});
