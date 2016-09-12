var ROOT_PATH = '../../../../../';

describe('Post Metadata Service', function () {

    var PostMetadataService,
        UserEndpoint,
        post,
        ContactEndpoint;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);
        testApp.service('PostMetadataService', require(ROOT_PATH + 'app/main/posts/common/post-metadata.service.js'))
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_PostMetadataService_, _ContactEndpoint_, _UserEndpoint_) {
        PostMetadataService = _PostMetadataService_;
        ContactEndpoint = _ContactEndpoint_;
        UserEndpoint = _UserEndpoint_;

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
        it('should load a user', function () {
            post = {
                user: {
                    id: 1
                }
            };

            spyOn(UserEndpoint, 'get').and.callThrough();
            PostMetadataService.loadUser(post);
            expect(UserEndpoint.get).toHaveBeenCalled();
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
