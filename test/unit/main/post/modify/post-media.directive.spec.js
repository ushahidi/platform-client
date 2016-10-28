var ROOT_PATH = '../../../../../';

describe('post media directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        formCtrl,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postMedia', require(ROOT_PATH + 'app/main/posts/modify/post-media.directive'))
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $scope.media = 5;
        element = '<form name="form"><post-media name="media-test" media="mediaVal" media-id="5"></post-media></form>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.children().isolateScope();
        formCtrl = element.controller('form');
    }));

    it('should load media properties', function () {

        expect(isolateScope.media.caption).toEqual('test caption');
        expect(isolateScope.media.original_file_url).toEqual('http://localhost/test.png');
    });
});
