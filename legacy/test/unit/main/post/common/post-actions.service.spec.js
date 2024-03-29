describe('Post Actions Service', function () {

    var PostActionsService,
        post,
        Notify,
        PostsSdk,
        mockState = {
            go: jasmine.createSpy()
        };

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();
        testApp.service('PostActionsService', require('app/map/post-card/post-actions.service.js'))
        .value('$filter', function () {
            return function () {};
        }).service('$state', function () {
            return mockState;
        });
        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_PostActionsService_, _Notify_, _PostsSdk_) {
        PostActionsService = _PostActionsService_;
        Notify = _Notify_;
        PostsSdk = _PostsSdk_;

        post = fixture.load('posts/120.json');
    }));

    describe('post action service functions', function () {
        it('should notify user before deleting a post', function () {
            spyOn(Notify, 'confirmDelete').and.callThrough();
            PostActionsService.delete(post);

            expect(Notify.confirmDelete).toHaveBeenCalled();
        });

        it('should delete a post', function () {
            spyOn(PostsSdk, 'deletePost').and.callThrough();
            PostActionsService.delete(post);

            expect(PostsSdk.deletePost).toHaveBeenCalled();
        });

        it('should return a list of statuses', function () {
            var result = PostActionsService.getStatuses();

            expect(result).toEqual(['published', 'draft', 'archived']);
        });
    });
});
