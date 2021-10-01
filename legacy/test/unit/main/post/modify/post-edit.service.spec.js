describe('Post Edit Service', function () {

    var PostEditService,
        tasks,
        attributes,
        form,
        post,
        $rootScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();
        testApp.service('PostEditService', require('app/data/common/post-edit-create/post-edit.service.js'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _PostEditService_, _$window_) {
        $rootScope = _$rootScope_;
        PostEditService = _PostEditService_;

        post = fixture.load('posts/120.json');
    }));

    describe('test service functions', function () {
        it('should return invalid if any of the following are invalid: title, content or form', function () {
            form = undefined;
            var result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(false);

            form = {};
            form.title = {$invalid: true};
            form.content = {$invalid: true};
            result = PostEditService.validatePost(post, form, post.post_content);

            expect(result).toBe(false);

            form.title = {$invalid: true};
            form.content = {$invalid: false};
            result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(false);

            form.title = {$invalid: false};
            form.content = {$invalid: false};
            form.$error = {videoUrlValidation: []};
            form.$setValidity = function () { };
            result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(false);
        });

        it('should return invalid a post required field is not defined and when a post required field is invalid', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            form.$error = {videoUrlValidation: false};
            post.post_content[0].fields[0].required = true;

            // Test undefined
            var result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(false);

            // Test invalid
            form['values_' + post.post_content[0].fields[0].id] = {$invalid: true};
            result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(false);

        });

        it('should return valid when the post task required attribute has a defined and valid value', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            form.$error = {videoUrlValidation: false};

            post.post_content[0].fields[0].required = true;
            form['values_' + post.post_content[0].fields[0].id] = {$invalid: false};

            var result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(true);
        });

        it('should return valid when only one of checkbox attributes values are set', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            form.$error = {videoUrlValidation: false};
            post.post_content[0].fields[0].required = true;
            post.post_content[0].fields[0].type = 'checkbox';
            post.post_content[0].fields[0].options = ['op1', 'op2'];

            form['values_' + post.post_content[0].fields[0].id] = {$invalid: false};

            var result = PostEditService.validatePost(post, form, post.post_content);
            expect(result).toBe(true);
        });

        it('should clean the given post values removing null entries', function () {
            post.post_content[0].fields[0].type = 'tags';
            post.post_content[0].fields[0].value = [{id: 1, label:'op1'},{id: 2, label: 'op2'}];
            var cleanPost = {
                value: [{id: 1, label:'op1'},{id: 2, label: 'op2'}]
            };
            var result = PostEditService.cleanTagValues(post);
            expect(result.post_content[0].fields[0].value).toEqual(cleanPost);
        });

        it('should return valid array of strings containing parts of url when url validation passes conditions', function () {
            var result = PostEditService.validateVideoUrl('https://www.youtube.com/video/1234');

            delete result.index;
            delete result.input;
            expect(result).toEqual(['https://www.youtube.com/video/1234', 'https:', 'www.', 'youtube.com', 'be.com', 'video/', '1234', undefined]);

        });

        it('should return null when url validation does not pass conditions', function () {
            // Test invalid url
            var result = PostEditService.validateVideoUrl('test_invalid_url');
            expect(result).toBeNull();

            // Test unsupported site
            var result = PostEditService.validateVideoUrl('https://www.test.com/video/1234');
            expect(result).toBeNull();
        });

    });
});
