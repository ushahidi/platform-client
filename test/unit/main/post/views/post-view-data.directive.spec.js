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
        .factory('dayjs', function () {
            return require('dayjs');
        })
        .factory('utc', function () {
            return require('dayjs/plugin/utc');
        })
        .factory('relativeTime', function () {
            return require('dayjs/plugin/relativeTime');
        })
        .factory('isSameOrBefore', function () {
            return require('dayjs/plugin/isSameOrBefore');
        })
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

});
