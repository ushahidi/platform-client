describe('Post create controller', function () {
    var $scope, $controller;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        makeTestApp()
        .value('PostEntity', function () {
            return fixture.load('posts/120.json');
        })
        .controller('postCreateController', require('app/data/post-create/post-create.controller.js'))
        .service('$transition$', function () {
            return {
                'params': function () {
                    return {
                        'id': 1
                    };
                }
            };
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

    }));

    beforeEach(function () {
        $controller('postCreateController', {
            $scope: $scope
        });
    });

    it('should load and set options', function () {
        expect($scope.post.allowed_privileges[0]).toEqual('read');
        expect($scope.post.form.id).toEqual(1);
    });
});
