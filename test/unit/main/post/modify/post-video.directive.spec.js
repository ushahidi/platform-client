var ROOT_PATH = '../../../../../';

describe('post video directive', function () {

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

        testApp.directive('postVideo', require(ROOT_PATH + 'app/main/posts/modify/post-video.directive'))
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
        $scope.videoUrl = 'https://youtube.com/watch/1234';
        element = '<post-video videoUrl="videoUrl"></post-video>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('test directive functions', function () {
        it('should fail to contrust iframe', function () {
            spyOn(Notify, 'error');
            isolateScope.constructIframe('test_url');
            expect(Notify.error).toHaveBeenCalled();
        });

        it('should construct an iframe from a video url', function () {
            isolateScope.constructIframe('https://www.youtube.com/video/1234');
            expect(isolateScope.videoUrl).toEqual('https://www.youtube.com/embed/1234');
        });
    });
});
