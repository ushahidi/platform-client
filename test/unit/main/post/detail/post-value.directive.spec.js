describe('post value directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        GlobalFilter,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postValue', require('app/main/posts/detail/post-value.directive'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
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
