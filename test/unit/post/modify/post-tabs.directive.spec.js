var ROOT_PATH = '../../../../';

describe('post vertical tabs directive', function () {

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

        testApp.directive('postTabs', require(ROOT_PATH + 'app/post/modify/post-tabs.directive'))
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

    describe('test directive functions', function () {
        it('should set the current visible stage', function () {
            isolateScope.setVisibleStage(1);
            expect(isolateScope.visibleStage).toEqual(1);
        });

        it('should check if a stage is complete', function () {
            var result = isolateScope.stageIsComplete(1);
            expect(result).toBe(false);

            $scope.post.completed_stages = [1];
            result = isolateScope.stageIsComplete(1);
            expect(result).toBe(true);
        });

        it('should toggle stage completeion', function () {
            isolateScope.form = {};
            isolateScope.form.tags = {$invalid: false};
            isolateScope.form.title = {$invalid: false};
            isolateScope.form.content = {$invalid: false};
            isolateScope.form['values_' + isolateScope.attributes[1].key] = {$invalid: false};

            $scope.post.completed_stages = [];

            isolateScope.toggleStageCompletion(1);
            expect($scope.post.completed_stages[0]).toEqual(1);

            isolateScope.toggleStageCompletion(1);
            expect($scope.post.completed_stages.length).toEqual(0);
        });
    });
});
