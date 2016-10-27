describe('post toolbox directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        element;

    function moment() {
        return {
            format: function () {}
        };
    }

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postToolbox', require('app/main/posts/modify/post-toolbox.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('moment', moment);

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $scope.post = fixture.load('posts/120.json');
        element = '<post-toolbox post="post"></post-toolbox>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load statuses', function () {
        expect(isolateScope.statuses).toEqual(['published', 'draft', 'archived']);
    });

    it('should change status', function () {
        isolateScope.changeStatus('published');
        expect(isolateScope.post.status).toEqual('published');
    });

    // FIXME: Changing post author is disabled for now
    it('should check whether the user can change owner', function () {
        expect(isolateScope.allowedChangeOwner()).toBe(false);
    });

    it('should allow the user to edit the author', function () {
        isolateScope.editAuthor();
        expect(isolateScope.showEditAuthorForm).toBe(true);
    });

    it('should show the real name for a user', function () {
        isolateScope.post.user = {realname: 'Test user'};
        isolateScope.showEditAuthorForm = undefined;
        isolateScope.post.author_realname = undefined;

        expect(isolateScope.showUserRealname()).toBeTruthy();
    });

    it('should show the author for a post', function () {
        isolateScope.post.user = {realname: 'Test user'};
        isolateScope.showEditAuthorForm = undefined;
        isolateScope.post.author_realname = 'Test author';

        expect(isolateScope.showAuthorRealname()).toBeTruthy();
    });

    it('should not load a form if a user or author exists', function () {
        isolateScope.post.user = {realname: 'Test user'};
        isolateScope.post.author_realname = 'Test author';
        isolateScope.loadAuthorFormDefaults();

        expect(isolateScope.showEditAuthorForm).toBe(false);
        expect(isolateScope.showEditAuthorButton).toBe(true);
    });

    it('should load a form if a user and author does not exist', function () {
        isolateScope.loadAuthorFormDefaults();

        expect(isolateScope.showEditAuthorForm).toBe(true);
        expect(isolateScope.showEditAuthorButton).toBe(false);
    });
});
