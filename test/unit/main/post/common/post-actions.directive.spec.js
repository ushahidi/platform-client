describe('post actions directive', function () {

    var $rootScope,
        $scope,
        $location,
        isolateScope,
        element,
        PostActionsService,
        PostEndpoint,
        mockRoute = {
            reload: jasmine.createSpy()
        };

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postActions', require('app/main/posts/common/post-actions.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('$route', mockRoute);

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _PostEndpoint_, _PostActionsService_, _$location_) {
        $rootScope = _$rootScope_;
        PostEndpoint = _PostEndpoint_;
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
        spyOn($location, 'path').and.returnValue('/views/list');

        isolateScope.deletePost(isolateScope.post);
        expect(PostActionsService.delete).toHaveBeenCalled();
        expect(mockRoute.reload).toHaveBeenCalled();
    });

    it('should delete a post and redirect to list', function () {
        spyOn(PostActionsService, 'delete').and.returnValue({
            then: function (cb) {
                cb();
            }
        });
        spyOn($location, 'path').and.returnValue('/post/120');

        isolateScope.deletePost(isolateScope.post);
        expect(PostActionsService.delete).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/views/list');
    });

    it('should update the status of a  post', function () {
        var status = 'published';
        spyOn(PostEndpoint, 'update').and.callThrough();
        isolateScope.updateStatus(status);

        expect(isolateScope.post.status).toEqual('published');
        expect(PostEndpoint.update).toHaveBeenCalled();
    });
});
