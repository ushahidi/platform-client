var ROOT_PATH = '../../../../';

describe('post preview media directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        MediaEndpoint,
        FormAttributeEndpoint,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postPreviewMedia', require(ROOT_PATH + 'app/post/directives/post-preview-media-directive'))
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

        $scope.post = {
            form: {
                id: 1
            },
            values: {
                media_test: 7
            }
        };

        element = '<post-preview-media post="post"></post-preview-media>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load media properties', inject(function (_MediaEndpoint_, _FormAttributeEndpoint_) {
        MediaEndpoint = _MediaEndpoint_;
        FormAttributeEndpoint = _FormAttributeEndpoint_;

        expect(isolateScope.media.caption).toEqual('test caption');
        expect(isolateScope.media.original_file_url).toEqual('http://localhost/test.png');
    }));
});
