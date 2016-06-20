var ROOT_PATH = '../../../../';

describe('Post create controller', function () {
    var $scope,
       $controller,
       PostEndpoint,
       FormEndpoint;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');
        fixture.setBase('mocked_backend/api/v3');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ])
        .value('PostEntity', function () {
            return fixture.load('posts/120.json');
        })
        .controller('postCreateController', require(ROOT_PATH + 'app/post/modify/post-create.controller.js'))
        ;

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_,
                                _$controller_,
                                _PostEndpoint_,
                                _FormEndpoint_
                               ) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        PostEndpoint = _PostEndpoint_;
        FormEndpoint = _FormEndpoint_;
    }));

    beforeEach(function () {
        $controller('postCreateController', {
            $scope: $scope,
            $routeParams: { id: 1 }
        });
    });

    it('should load and set options', function () {
        expect($scope.post.allowed_privileges[0]).toEqual('read');
        expect($scope.post.form.id).toEqual(1);
    });
});
