var ROOT_PATH = '../../../../';

describe('post editor directive', function () {

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

        testApp.directive('postStatus', require(ROOT_PATH + 'app/post/directives/post-status.directive'))
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

        element = '<post-status post="post" stages="stages"></post-status>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('test directive functions', function () {
        it('should check allowed status', function () {

            isolateScope.post.allowed_privileges = 'change_status';
            expect(isolateScope.allowedChangeStatus()).toBe(true);
        });
    });
});
