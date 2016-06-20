var rootPath = '../../../../../';

describe('PostEndpoint', function () {

    var $rootScope,
        $httpBackend,
        BACKEND_URL,
        PostEndpoint,
        mockPostResponse;


    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ngResource'
        ])
        .service('PostEndpoint', require(rootPath + 'app/common/services/endpoints/post-endpoint.js'));

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _CONST_, _PostEndpoint_) {
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        BACKEND_URL = _CONST_.BACKEND_URL;
        PostEndpoint = _PostEndpoint_;
    }));

    beforeEach(function () {
        mockPostResponse = {
            results: [{
            'id': '1',
            'type': 'report',
            'title': 'Test post'
        }]};
    });

    it('should call the correct url and return the correct data', function () {
        var successCallback = jasmine.createSpy('success');
        $httpBackend.expectGET(BACKEND_URL + '/api/v2/posts?order=desc&orderby=created').respond(mockPostResponse);

        PostEndpoint.query().$promise.then(successCallback);

        $httpBackend.flush();
        $rootScope.$digest();

        expect(successCallback).toHaveBeenCalled();

        var actualFirstResource = successCallback.calls.mostRecent().args[0].results[0];
        var expectedFirstResource = mockPostResponse.results[0];
        expect(actualFirstResource.id).toEqual(expectedFirstResource.id);
        expect(actualFirstResource.type).toEqual(expectedFirstResource.type);
        expect(actualFirstResource.title).toEqual(expectedFirstResource.title);
    });

});
