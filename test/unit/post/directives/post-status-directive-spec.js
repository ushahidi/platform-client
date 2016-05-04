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

        testApp.directive('postStatus', require(ROOT_PATH + 'app/post/directives/post-status-directive'))
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
        it('should publish a post to a given role', function () {
            spyOn(Notify, 'showNotificationSlider');

            isolateScope.post.id = 'pass';
            isolateScope.publishPostTo();
            expect(Notify.showNotificationSlider).toHaveBeenCalled();
        });

        it('should fail to publish a post to a given role', function () {
            spyOn(Notify, 'showApiErrors');

            isolateScope.post.id = 'fail';
            isolateScope.publishPostTo();
            expect(Notify.showApiErrors).toHaveBeenCalled();
        });

        it('should fail to publish a post to a given role when a required stage is not completed', function () {
            spyOn(Notify, 'showAlerts');

            isolateScope.post.id = 'pass';
            $scope.stages[1].required = true;
            isolateScope.post.completed_stages = [];

            isolateScope.publishPostTo();
            expect(Notify.showAlerts).toHaveBeenCalled();
        });

        it('should only set the publish field and not call an update', function () {
            $scope.stages[1].required = false;

            var cpyPost = {published_to: ['user']};
            isolateScope.post = cpyPost;
            isolateScope.publishPostTo();
            expect(isolateScope.post.published_to).toEqual(['user']);
        });
    });
});
