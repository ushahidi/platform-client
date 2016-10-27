describe('post actions directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        element,
        PostActionsService,
        PostEndpoint;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postActions', require('app/main/posts/common/post-actions.directive'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _PostEndpoint_, _PostActionsService_) {
        $rootScope = _$rootScope_;
        PostEndpoint = _PostEndpoint_;
        PostActionsService = _PostActionsService_;
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
        spyOn(PostActionsService, 'delete').and.callThrough();
        isolateScope.deletePost(isolateScope.post);
        expect(PostActionsService.delete).toHaveBeenCalled();
    });

    it('should update the status of a  post', function () {
        var status = 'published';
        spyOn(PostEndpoint, 'update').and.callThrough();
        isolateScope.updateStatus(status);

        expect(isolateScope.post.status).toEqual('published');
        expect(PostEndpoint.update).toHaveBeenCalled();
    });
});
