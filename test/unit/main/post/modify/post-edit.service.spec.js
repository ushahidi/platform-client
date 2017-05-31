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
        testApp.service('PostEditService', require('app/main/posts/modify/post-edit.service.js'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _PostEditService_, _$window_) {
        $rootScope = _$rootScope_;
        PostEditService = _PostEditService_;

        post = fixture.load('posts/120.json');
        var taskData = fixture.load('tasks.json');
        tasks = taskData.results;
        var attributeData = fixture.load('attributes.json');
        attributes = attributeData.results;

        _.each(tasks, function (task) {
            task.attributes = [];
            _.each(attributes, function (attribute) {
                if (attribute.form_stage_id === task.id) {
                    task.attributes.push(attribute);
                }
            });
        });

    }));

    describe('test service functions', function () {
        it('should return invalid if any of the following are invalid: title, content or form', function () {
            form = undefined;
            var result = PostEditService.validatePost(post, form, tasks);
            expect(result).toBe(false);

            form = {};
            form.title = {$invalid: true};
            form.content = {$invalid: true};
            result = PostEditService.validatePost(post, form, tasks);

            expect(result).toBe(false);

            form.title = {$invalid: true};
            form.content = {$invalid: false};
            result = PostEditService.validatePost(post, form, tasks);

            expect(result).toBe(false);
        });

        it('should return invalid a post required field is not defined and when a post required field is invalid', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            var tasks_copy = [];
            tasks_copy.push(tasks[0]);

            tasks_copy[0].attributes[0].required = true;

            // Test undefined
            var result = PostEditService.validatePost(post, form, tasks_copy);
            expect(result).toBe(false);

            // Test invalid
            form['values_' + tasks_copy[0].attributes[0].id] = {$invalid: true};
            result = PostEditService.validatePost(post, form, tasks_copy);
            expect(result).toBe(false);

        });

        it('should return valid when the post task required attribute has a defined and valid value', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};

            var tasks_copy = [];
            tasks_copy.push(tasks[0]);
            tasks_copy[0].attributes[0].required = true;

            form['values_' + tasks_copy[0].attributes[0].id] = {$invalid: false};

            var result = PostEditService.validatePost(post, form, tasks_copy);

            expect(result).toBe(true);
        });

        it('should return valid when only one of checkbox attributes values are set', function () {
            form = {};
            form.tags = {$invalid: false};
            form.title = {$invalid: false};
            form.content = {$invalid: false};
            var tasks_copy = [];
            tasks_copy.push(tasks[0]);
            tasks_copy[0].attributes[0].required = true;
            tasks_copy[0].attributes[0].type = 'checkbox';
            tasks_copy[0].attributes[0].options = ['op1', 'op2'];

            form['values_' + tasks_copy[0].attributes[0].id] = {$invalid: false};

            var result = PostEditService.validatePost(post, form, tasks_copy);
            expect(result).toBe(true);
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
