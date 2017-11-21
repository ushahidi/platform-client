describe('Data View directive', function () {
    var $scope,
       $rootScope,
       isolateScope,
       PostEndpoint,
       Notify,
       $compile,
       $transitions,
       element;

    const posts = require('../../../../../mocked_backend/api/v3/posts.json');

    beforeEach(function () {
        let testApp = makeTestApp();

        testApp.directive('postViewData', require('app/main/posts/views/post-view-data.directive.js'))
         .service('$state', function () {
            return {
                go: function () {
                    return {
                        'id': 1
                    };
                },
                params: {}
            };
        })
        .service('PostEndpoint', function () {
            return {
                query: function () {
                    return {$promise: {
                        then: function (successCallback, failCallback) {
                            successCallback(posts);
                        }
                    }};
                }
            };
        })
        .factory('moment', function () {
            return require('moment');
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _Notify_, _PostEndpoint_, _$compile_, _$transitions_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        PostEndpoint = _PostEndpoint_;
        $compile = _$compile_;
        $transitions = _$transitions_;

        element = '<post-view-data></post-view-data>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();

        // postDoesNotMatchFilters = function (postObj) {
        //     return {$promise: {
        //             then: function (successCallback, failCallback) {
        //                 successCallback(true);
        //             }
        //         }
        //     }};

    }));

    it('should get a list of posts', function () {
        expect(isolateScope.posts.length).toEqual(posts.results.length);
    });

    // it('should remove a post from the list if the post does not match filters', function () {
    //     isolateScope.removePostThatDoesntMatchFilters(posts.results[1]);
    //     expect(isolateScope.posts.length).toEqual(9);
    // });

    // it('should show the current published state as draft', function () {
    //     expect(isolateScope.publishedFor()).toEqual('post.publish_for_you');
    // });

    // it('should show type as false for point and geometry but true for other', function () {
    //     expect(isolateScope.showType('point')).toEqual(false);
    //     expect(isolateScope.showType('geometry')).toEqual(false);
    //     expect(isolateScope.showType('other')).toEqual(true);
    // });

    // it('should publish a post to a given role', function () {
    //     spyOn(Notify, 'notify');

    //     isolateScope.post.id = 'pass';
    //     isolateScope.publishPostTo(isolateScope.post);
    //     expect(Notify.notify).toHaveBeenCalled();
    // });

    // it('should fail to publish a post to a given role', function () {
    //     spyOn(Notify, 'apiErrors');

    //     isolateScope.post.id = 'fail';
    //     isolateScope.publishPostTo(isolateScope.post);
    //     expect(Notify.apiErrors).toHaveBeenCalled();
    // });

    // it('should fail to publish a post to a given role when a required stage is not completed', function () {
    //     spyOn(Notify, 'errorsPretranslated');

    //     isolateScope.post.id = 'pass';
    //     isolateScope.tasks = [{
    //         required: true
    //     }];
    //     isolateScope.post.completed_stages = [];

    //     isolateScope.publishPostTo(isolateScope.post);
    //     expect(Notify.errorsPretranslated).toHaveBeenCalled();
    // });

    // /* @todo test in post actions
    // it('should delete a post', function () {
    //     spyOn(Notify, 'notify');

    //     $scope.post.id = 'pass';
    //     $scope.deletePost();

    //     expect(Notify.notify).toHaveBeenCalled();
    // });

    // it('should fail to delete a post', function () {
    //     spyOn(Notify, 'apiErrors');

    //     $scope.post.id = 'fail';
    //     $scope.deletePost();

    //     expect(Notify.apiErrors).toHaveBeenCalled();
    // });
    //  */


});
