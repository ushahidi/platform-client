describe('Post edit controller', function () {
    var $scope,
       $controller;

    var mockFormEndpoint = {
        get: function (parameters, success, error) {
            return success({name: 'test form'});
        },
        getFresh: function (parameters, success, error) {
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
        makeTestApp()
        .controller('postEditController', require('app/main/posts/modify/post-edit.controller.js'))
        .service('$transition$', function () {
            return {
                'params': function () {
                    return {
                        'id': 1
                    };
                }
            };
        })
        .service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        $controller('postEditController', {
            $scope: $scope,
            FormEndpoint: mockFormEndpoint,
            PostEndpoint: mockPostEndpoint
        });
    }));

    it('should set post correctly', function () {
        expect($scope.post.title).toEqual('test');
    });
});
