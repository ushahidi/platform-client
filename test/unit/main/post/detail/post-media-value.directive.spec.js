describe('post media value directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        MediaEndpoint,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postMediaValue', require('app/main/posts/detail/post-media-value.directive'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        element = '<post-media-value media-id="5"></post-media-value>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load media properties', angular.mock.inject(function (_MediaEndpoint_) {
        MediaEndpoint = _MediaEndpoint_;

        expect(isolateScope.media.caption).toEqual('test caption');
        expect(isolateScope.media.original_file_url).toEqual('http://localhost/test.png');
    }));
});
