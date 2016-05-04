var ROOT_PATH = '../../../../';

describe('post media directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        MediaEndpoint,
        $httpBackend,
        CONST,
        formCtrl,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postMedia', require(ROOT_PATH + 'app/post/directives/post-media-directive'))
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

        element = '<form name="form"><post-media name="media-test" media-id="5"></post-media></form>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.children().isolateScope();
        formCtrl = element.controller('form');
    }));

    it('should load media properties', inject(function (_MediaEndpoint_) {
        MediaEndpoint = _MediaEndpoint_;

        expect(isolateScope.media.caption).toEqual('test caption');
        expect(isolateScope.media.original_file_url).toEqual('http://localhost/test.png');
    }));

    it('should upload a file and return an id', inject(function (_$httpBackend_, _CONST_) {
        $httpBackend = _$httpBackend_;
        CONST = _CONST_;

        formCtrl[isolateScope.name] = {
            $setDirty: jasmine.createSpy('$setDirty')
        };

        $httpBackend.whenPOST(CONST.API_URL + '/media')
           .respond({id: 7});

        isolateScope.fileContainer.file = {
            name: 'file.png',
            type: 'image/jpeg'
        };

        isolateScope.uploadFile();

        $httpBackend.flush();

        expect(isolateScope.mediaId).toEqual(7);
        expect(formCtrl[isolateScope.name].$setDirty).toHaveBeenCalled();
    }));
});
