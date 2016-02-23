var ROOT_PATH = '../../../../';

describe('post preview directive', function () {

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

        testApp.directive('postPreview', require(ROOT_PATH + 'app/post/directives/post-preview-directive'))
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

        element = '<post-preview post="post"></post-preview>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
    }));

    describe('test directive functions', function () {
        it('should publish a post to a given role', function () {
            spyOn(Notify, 'showNotificationSlider');

            $scope.post.id = 'pass';
            isolateScope.publishPostTo($scope.post);
            expect(Notify.showNotificationSlider).toHaveBeenCalled();
        });

        it('should fail to publish a post to a given role', function () {
            spyOn(Notify, 'showApiErrors');

            $scope.post.id = 'fail';
            isolateScope.publishPostTo($scope.post);
            expect(Notify.showApiErrors).toHaveBeenCalled();
        });

        it('should fail to publish a post to a given role when a required stage is not completed', function () {
            spyOn(Notify, 'showAlerts');

            $scope.post.id = 'pass';
            isolateScope.stages = [{
                id: 1,
                name: 'test stage',
                required: true
            }];
            isolateScope.post.completed_stages = [];

            isolateScope.publishPostTo($scope.post);
            expect(Notify.showAlerts).toHaveBeenCalled();
        });
    });
});
