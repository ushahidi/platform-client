describe('Post Metadata Service', function () {

    var PostMetadataService,
        UserEndpoint,
        post,
        ContactEndpoint,
        $rootScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();
        testApp.service('PostMetadataService', require('app/main/posts/common/post-metadata.service.js'))
        .value('$filter', function () {
            return function () {};
        });



        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_PostMetadataService_, _ContactEndpoint_, _UserEndpoint_, _$rootScope_) {
        PostMetadataService = _PostMetadataService_;
        ContactEndpoint = _ContactEndpoint_;
        UserEndpoint = _UserEndpoint_;
        $rootScope = _$rootScope_;
        post = fixture.load('posts/120.json');
    }));

    describe('Post metadata service functions', function () {
        it('should format source as SMS', function () {
            var source = 'sms';
            spyOn(PostMetadataService, 'formatSource').and.callThrough();
            var result = PostMetadataService.formatSource(source);
            expect(result).toEqual('SMS');
        });

        it('should format source as Web', function () {
            spyOn(PostMetadataService, 'formatSource').and.callThrough();
            var result = PostMetadataService.formatSource();
            expect(result).toEqual('Web');
        });
        it('should load a user if Manage Users permission', function () {
            $rootScope.hasPermission = ()=>true;
            post = {
                user: {
                    id: 1
                }
            };

            spyOn(UserEndpoint, 'get').and.callThrough();
            PostMetadataService.loadUser(post);
            expect(UserEndpoint.get).toHaveBeenCalled();
        });
        it('should not attempt to load a user if not Manage Users permission', function () {
            $rootScope.hasPermission = ()=>false;
            post = {
                user: {
                    id: 1
                }
            };

            spyOn(UserEndpoint, 'get').and.callThrough();
            PostMetadataService.loadUser(post);
            expect(UserEndpoint.get).not.toHaveBeenCalled();
        });
        it('should load a contact', function () {
            post = {
                contact: {
                    id: 1
                }
            };

            spyOn(ContactEndpoint, 'get').and.callThrough();
            PostMetadataService.loadContact(post);
            expect(ContactEndpoint.get).toHaveBeenCalled();
        });
    });
});
