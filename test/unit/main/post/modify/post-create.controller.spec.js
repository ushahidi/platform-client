describe('Post create controller', function () {
    var $scope,
       $controller,
       PostEndpoint,
       FormEndpoint;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        makeTestApp()
        .value('PostEntity', function () {
            return fixture.load('posts/120.json');
        })
        .controller('postCreateController', require('app/main/posts/modify/post-create.controller.js'))
        ;

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_,
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
