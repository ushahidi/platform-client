describe('post actions directive', function () {

    var $rootScope,
        $scope,
        $location,
        isolateScope,
        element,
        PostActionsService,
        PostsSdk,
        mockState = {
            go: jasmine.createSpy(),
            reload: jasmine.createSpy(),
            $current: {
                includes: {
                    'posts.data.detail' : true,
                    'posts.data' : true,
                    'posts' : true
                }
            }
        };

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postActions', require('app/map/post-card/post-actions.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .service('$state', function () {
            return mockState;
        });

        angular.mock.module('testApp');
    });


    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _PostsSdk_, _PostActionsService_, _$location_) {
        $rootScope = _$rootScope_;
        PostsSdk = _PostsSdk_;
        PostActionsService = _PostActionsService_;
        $location = _$location_;

        $scope = _$rootScope_.$new();
        $scope.post = fixture.load('posts/120.json');

        element = '<post-actions post="post"></post-actions>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load statuses', function () {
        expect(isolateScope.statuses).toEqual(['published', 'draft', 'archived']);
    });

    it('should delete a post', function () {
        spyOn(PostActionsService, 'delete').and.returnValue({
            then: function (cb) {
                cb();
            }
        });
        mockState.$current.includes = {
            'posts.data.detail' : true,
            'posts.data' : true,
            'posts' : true
        };

        isolateScope.deletePost(isolateScope.post);
        expect(PostActionsService.delete).toHaveBeenCalled();
        expect(mockState.reload).not.toHaveBeenCalled();
        expect(mockState.go).not.toHaveBeenCalled();
    });

    it('should delete a post and reload the map', function () {
        spyOn(PostActionsService, 'delete').and.returnValue({
            then: function (cb) {
                cb();
            }
        });
        mockState.$current.includes = {
            'posts' : true,
            'posts.map' : true
        };

        isolateScope.deletePost(isolateScope.post);
        expect(PostActionsService.delete).toHaveBeenCalled();
        expect(mockState.reload).toHaveBeenCalled();
        expect(mockState.go).not.toHaveBeenCalled();
    });

    it('should update the status of a post', function () {
        var status = 'published';
        spyOn(PostsSdk, 'patchPost').and.callThrough();
        isolateScope.updateStatus(status);

        expect(isolateScope.post.status).toEqual('published');
        expect(PostsSdk.patchPost).toHaveBeenCalled();
    });
});
