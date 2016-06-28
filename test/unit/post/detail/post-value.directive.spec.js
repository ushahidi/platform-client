var ROOT_PATH = '../../../../';

describe('post value directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        GlobalFilter,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postValue', require(ROOT_PATH + 'app/post/detail/post-value.directive'))
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        GlobalFilter = _GlobalFilter_;
        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');
        $scope.value = ['pass'];
        $scope.attribute = {
            type: 'relation'
        };

        element = '<post-value value="value" key="key" attribute="attribute"></post-value>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
        isolateScope.$digest();
    }));

    describe('test directive functions', function () {
        it('should set the value var if the type if relation', function () {
            expect(typeof (isolateScope.value[0])).toEqual('object');
        });
    });
});
