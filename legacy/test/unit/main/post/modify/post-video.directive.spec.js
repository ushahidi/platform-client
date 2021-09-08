describe('post video directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp
        .directive('postVideo', require('app/data/common/post-edit-create/post-video.directive'))
        .value('Util', {
            simpluUUID: function () {
            return 'abc123';
                },
            bindAllFunctionsToSelf: function () {
                return {};
            }
        })
        ;

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        $scope.$parent.form = {
            '$error': [],
            '$setValidity': function () { }
        };
        $scope.videoUrl = 'https://youtube.com/watch/1234';
        element = '<post-video videoUrl="videoUrl"></post-video>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('test directive functions', function () {
        it('should fail to construct iframe', function () {
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
