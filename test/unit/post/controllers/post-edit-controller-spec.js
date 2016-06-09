var ROOT_PATH = '../../../../';

describe('Post edit controller', function () {
    var $scope,
       $controller;

    var mockFormEndpoint = {
        get: function (parameters, success, error) {
            return success({name: 'test form'});
        }
    };
    var mockPostEndpoint = {
        get: function (parameters, success, error) {
            var post = {
                tags: [],
                form: {
                    id: 1
                },
                user: {
                    id: 1
                },
                title: 'test',
                status: 'draft',
                completed_stages: ['1', '2', '3'],
                allowed_privileges: ['get', 'update']
            };
            if (success) {
                success(post);
            }
            return {
                $promise : {
                    then : function (cb) {
                        cb(post);
                    }
                }
            };
        }
    };

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ngResource',
            'angular-cache',
            'leaflet-directive'
        ])
       .controller('postEditController', require(ROOT_PATH + 'app/post/controllers/post-edit-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        $controller('postEditController', {
            $scope: $scope,
            FormEndpoint: mockFormEndpoint,
            PostEndpoint: mockPostEndpoint,
            $routeParams: { id: 1 }
        });
    }));

    it('should set post correctly', function () {
        expect($scope.post.title).toEqual('test');
    });
});
