describe('Post edit controller', function () {
    var $scope,
        $rootScope,
        $controller,
        $q;

    var mockFormEndpoint = {
        get: function (parameters, success, error) {
            return success({name: 'test form'});
        }
    };
    var mockPostEndpoint = {
        get: function (parameters, success, error) {
            var post = {
                id: 1,
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
            return { $promise: $q.when(post) };
        },
        requestLock: (params) => {
            var post = {
                id: 1,
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
            return {$promise: $q.when(post)};
        },
        checkLock: (params) => {
            var post = {
                id: 1,
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
            return {$promise: $q.when(post)};
        }
    };

    beforeEach(function () {
        makeTestApp()
        .controller('postEditController', require('app/main/posts/modify/post-edit.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$q_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        $rootScope = _$rootScope_;

        $controller('postEditController', {
            $scope: $scope,
            FormEndpoint: mockFormEndpoint,
            PostEndpoint: mockPostEndpoint,
            $routeParams: { id: 1 }
        });
    }));

    it('should set post correctly', function () {
        $rootScope.$apply();

        expect($scope.post.title).toEqual('test');
    });
});
