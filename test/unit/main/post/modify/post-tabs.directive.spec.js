describe('post vertical tabs directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postTabs', require('app/main/posts/modify/post-tabs.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');
        var stages = fixture.load('stages.json');
        $scope.stages = stages.results;
        var attributes = fixture.load('attributes.json');
        $scope.attributes = attributes.results;
        $scope.visbileStage = 1;

        element = '<post-tabs form="form" post="post" stages="stages" attributes="attributes" visibleStage="visibleStage"></post-tabs>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));
});
