var rootPath = '../../../../';

describe('Post Edit Service', function () {

    var PostEditService,
        stages,
        attributes,
        form,
        post,
        $rootScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);
        testApp.service('PostEditService', require(rootPath + 'app/post/modify/post-edit.service.js'))
        .value('$filter', function () {
            return function () {};
        });

        require(rootPath + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _PostEditService_, _$window_) {
        $rootScope = _$rootScope_;
        PostEditService = _PostEditService_;

        post = fixture.load('posts/120.json');
        var stageData = fixture.load('stages.json');
        stages = stageData.results;
        var attributeData = fixture.load('attributes.json');
        attributes = attributeData.results;

    }));

    describe('test service functions', function () {
        it('should return true if the given stage is the first stage', function () {
            var result = PostEditService.isFirstStage(stages, 1);
            expect(result).toBe(true);
        });

        it('should return 0 if the given stage is not the first stage', function () {
            var result = PostEditService.isFirstStage(2);
            expect(result).toEqual(false);
        });

        it('should return invalid if it is the first stage and any of the following are invalid: title, content, tags or form', function () {
            form = undefined;
            var result = PostEditService.isStageValid(1, form, stages, attributes);

            expect(result).toBe(false);

            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: true};
            form.content = {$invalid: true};
            result = PostEditService.isStageValid(1, form, stages, attributes);

            expect(result).toBe(false);

            form.tags = {$invalid: true};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            result = PostEditService.isStageValid(1, form, stages, attributes);

            expect(result).toBe(false);
        });

        it('should return invalid when a required stage is undefined or the value is invalid', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};

            // Test undefined
            var result = PostEditService.isStageValid(1, form, stages, attributes);
            expect(result).toBe(false);


            // Test invalid
            form['values_' + attributes[5].id] = {$invalid: true};
            result = PostEditService.isStageValid(1, form, stages, attributes);
            expect(result).toBe(false);

        });

        it('should return valid when a required stage has a defined and valid value', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            form['values_' + attributes[5].id] = {$invalid: false};

            var result = PostEditService.isStageValid(1, form, stages, attributes);

            expect(result).toBe(true);
        });

        it('should return valid when only one of checkbox attributes values are set', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};

            attributes[5].input = 'checkbox';
            attributes[5].options = ['op1', 'op2'];
            attributes[5].required = true;
            form['values_' + attributes[5].id + '_op2'] = {$invalid: false};

            var result = PostEditService.isStageValid(1, form, stages, attributes);
            expect(result).toBe(true);
        });

        it('should return valid when the post is in draft', function () {
            post.status = 'draft';
            expect(PostEditService.canSavePost(post, form, stages, attributes)).toBe(true);
        });

        it('should return invalid when the post is in published and required stages are completed', function () {
            post.status = 'published';
            stages[1].required = true;
            post.completed_stages = [];
            expect(PostEditService.canSavePost(post, form, stages, attributes)).toBe(false);
        });

        it('should return invalid when the post is in published and completed stage is invalid', function () {
            post.status = 'published';
            stages[1].required = true;
            post.completed_stages = [2];
            spyOn(PostEditService, 'isStageValid').and.returnValue(false);

            expect(PostEditService.canSavePost(post, form, stages, attributes)).toBe(false);
        });

        it('should return valid when status is published and required stages are complete and valid', function () {
            post.status = 'published';
            stages[1].required = true;
            post.completed_stages = [2];
            spyOn(PostEditService, 'isStageValid').and.returnValue(true);

            expect(PostEditService.canSavePost(post, form, stages, attributes)).toBe(true);
        });

        it('should clean the given post values removing null entries', function () {
            post.values = {
                'test': undefined,
                'test 1': 'test'
            };
            var cleanPost = {};
            cleanPost.values = {
                'test 1': 'test'
            };
            var result = PostEditService.cleanPostValues(post);
            expect(result.length).toEqual(cleanPost.length);
        });
    });
});
