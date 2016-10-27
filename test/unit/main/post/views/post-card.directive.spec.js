describe('post card directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        GlobalFilter,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postCard', require('app/main/posts/views/post-card.directive'))
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

        element = '<post-card post="post"></post-card>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
    }));

    describe('test directive functions', function () {
    });
});
