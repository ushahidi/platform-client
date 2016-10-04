var ROOT_PATH = '../../../../../';

describe('Post Actions Service', function () {

    var PostActionsService,
        post,
        Notify,
        PostEndpoint;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);
        testApp.service('PostActionsService', require(ROOT_PATH + 'app/main/posts/common/post-actions.service.js'))
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_PostActionsService_, _Notify_, _PostEndpoint_) {
        PostActionsService = _PostActionsService_;
        Notify = _Notify_;
        PostEndpoint = _PostEndpoint_;

        post = fixture.load('posts/120.json');
    }));

    describe('post action service functions', function () {
        it('should notify user before deleting a post', function () {
            spyOn(Notify, 'confirmDelete').and.callThrough();
            PostActionsService.delete(post);

            expect(Notify.confirmDelete).toHaveBeenCalled();
        });

        it('should delete a post', function () {
            spyOn(PostEndpoint, 'delete').and.callThrough();
            PostActionsService.delete(post);

            expect(PostEndpoint.delete).toHaveBeenCalled();
        });

        it('should return a list of statuses', function () {
            var result = PostActionsService.getStatuses();

            expect(result).toEqual(['published', 'draft', 'archived']);
        });
    });
});
