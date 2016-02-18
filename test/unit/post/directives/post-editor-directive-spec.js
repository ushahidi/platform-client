var ROOT_PATH = '../../../../';

describe('post editor directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postEditor', require(ROOT_PATH + 'app/post/directives/post-editor-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');

        $scope.activeForm = {
            id: 1,
            name: 'Test form',
            type: 'Report',
            description: 'Testing form',
            created: '1970-01-01T00:00:00+00:00'
        };

        element = '<post-editor post="post" active-form="activeForm"></post-editor>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('Initial parameter loading', function () {
        it('should load provided post', function () {
            expect($scope.post.id).toEqual(120);
        });

        it('should load the associated form', function () {
            expect($scope.post.form.name).toEqual('test form');
        });

        it('should load the associated form attributes', function () {
            expect(isolateScope.attributes.length).toEqual(2);
        });

        it('should load the associated form stages', function () {
            expect(isolateScope.stages.length).toEqual(2);
        });
    });

    describe('test directive functions', function () {
        it('should set the post status to draft', function () {
            isolateScope.setDraft();
            expect($scope.post.status).toEqual('draft');
        });

        it('should set the current visible stage', function () {
            isolateScope.setVisibleStage(1);
            expect(isolateScope.visibleStage).toEqual(1);
        });

        it('should return true if the given stage is the first stage', function () {
            var result = isolateScope.isFirstStage(1);
            expect(result).toBe(true);
        });

        it('should return 0 if the given stage is not the first stage', function () {
            var result = isolateScope.isFirstStage(2);
            expect(result).toEqual(false);
        });

        it('should return invalid if it is the first stage and any of the following are invalid: title, content, tags or form', function () {
            isolateScope.form = undefined;
            var result = isolateScope.isStageValid(1);

            expect(result).toBe(false);

            isolateScope.form = {};
            isolateScope.form.tags = {$invalid: false};
            isolateScope.form.title = {$invalid: true};
            isolateScope.form.content = {$invalid: true};
            result = isolateScope.isStageValid(1);

            expect(result).toBe(false);

            isolateScope.form.tags = {$invalid: true};
            isolateScope.form.title = {$invalid: false};
            isolateScope.form.content = {$invalid: false};
            result = isolateScope.isStageValid(1);

            expect(result).toBe(false);
        });

        it('should return invalid when a required stage is undefined or the value is invalid', function () {
            isolateScope.form = {};
            isolateScope.form.tags = {$invalid: false};
            isolateScope.form.title = {$invalid: false};
            isolateScope.form.content = {$invalid: false};

            // Test undefined
            var result = isolateScope.isStageValid(1);
            expect(result).toBe(false);


            // Test invalid
            isolateScope.form['values_' + isolateScope.attributes[1].key] = {$invalid: true};
            result = isolateScope.isStageValid(1);
            expect(result).toBe(false);

        });

        it('should return valid when a required stage has a defined and valid value', function () {
            isolateScope.form = {};
            isolateScope.form.tags = {$invalid: false};
            isolateScope.form.title = {$invalid: false};
            isolateScope.form.content = {$invalid: false};
            isolateScope.form['values_' + isolateScope.attributes[1].key] = {$invalid: false};

            var result = isolateScope.isStageValid(1);

            expect(result).toBe(true);
        });

        it('should return valid when only one of checkbox attributes values are set', function () {
            isolateScope.form = {};
            isolateScope.form.tags = {$invalid: false};
            isolateScope.form.title = {$invalid: false};
            isolateScope.form.content = {$invalid: false};

            isolateScope.attributes[1].input = 'checkbox';
            isolateScope.attributes[1].options = ['op1', 'op2'];
            isolateScope.form['values_' + isolateScope.attributes[1].key + '_op2'] = {$invalid: false};

            var result = isolateScope.isStageValid(1);
            expect(result).toBe(true);
        });

        it('should check if a stage is complete', function () {
            var result = isolateScope.stageIsComplete(1);
            expect(result).toBe(false);

            $scope.post.completed_stages = [1];
            result = isolateScope.stageIsComplete(1);
            expect(result).toBe(true);
        });

        it('should toggle stage completeion', function () {
            isolateScope.form = {};
            isolateScope.form.tags = {$invalid: false};
            isolateScope.form.title = {$invalid: false};
            isolateScope.form.content = {$invalid: false};
            isolateScope.form['values_' + isolateScope.attributes[1].key] = {$invalid: false};

            $scope.post.completed_stages = [];

            isolateScope.toggleStageCompletion(1);
            expect($scope.post.completed_stages[0]).toEqual(1);

            isolateScope.toggleStageCompletion(1);
            expect($scope.post.completed_stages.length).toEqual(0);
        });

        it('should publish a post to a given role', function () {
            spyOn(Notify, 'showNotificationSlider');

            $scope.post.id = 'pass';
            isolateScope.publishPostTo($scope.post);
            expect(Notify.showNotificationSlider).toHaveBeenCalled();
        });

        it('should fail to publish a post to a given role', function () {
            spyOn(Notify, 'showApiErrors');

            $scope.post.id = 'fail';
            isolateScope.publishPostTo($scope.post);
            expect(Notify.showApiErrors).toHaveBeenCalled();
        });

        it('should fail to publish a post to a given role when a required stage is not completed', function () {
            spyOn(Notify, 'showAlerts');

            $scope.post.id = 'pass';
            isolateScope.stages[1].required = true;
            isolateScope.post.completed_stages = [];

            isolateScope.publishPostTo($scope.post);
            expect(Notify.showAlerts).toHaveBeenCalled();
        });

        it('should only set the publish field and not call an update', function () {
            isolateScope.stages[1].required = false;

            var cpyPost = {published_to: ['user']};

            isolateScope.publishPostTo(cpyPost);
            expect(isolateScope.post.published_to).toEqual(['user']);
        });

        it('should return valid when the post is in draft', function () {
            $scope.post.status = 'draft';
            expect(isolateScope.canSavePost()).toBe(true);
        });

        it('should return invalid when the post is in published and required stages are completed', function () {
            $scope.post.status = 'published';
            isolateScope.stages[1].required = true;
            isolateScope.post.completed_stages = [];
            expect(isolateScope.canSavePost()).toBe(false);
        });

        it('should return invalid when the post is in published and completed stage is invalid', function () {
            $scope.post.status = 'published';
            isolateScope.stages[1].required = true;
            isolateScope.post.completed_stages = [2];
            spyOn(isolateScope, 'isStageValid').and.returnValue(false);

            expect(isolateScope.canSavePost()).toBe(false);
        });

        it('should return valid when status is published and required stages are complete and valid', function () {
            $scope.post.status = 'published';
            isolateScope.stages[1].required = true;
            isolateScope.post.completed_stages = [2];
            spyOn(isolateScope, 'isStageValid').and.returnValue(true);

            expect(isolateScope.canSavePost()).toBe(true);
        });

        it('should save a post', function () {
            spyOn(Notify, 'showNotificationSlider');

            $scope.post.id = 'pass';
            isolateScope.savePost();

            expect(Notify.showNotificationSlider).toHaveBeenCalled();
        });

        it('should fail to save a post', function () {
            spyOn(Notify, 'showApiErrors');

            $scope.post.id = 'fail';
            isolateScope.savePost();

            expect(Notify.showApiErrors).toHaveBeenCalled();
        });

        it('should return the correct value for each attr input', function () {
            expect(isolateScope.isDate({input: 'date'})).toBe(true);
            expect(isolateScope.isDateTime({input: 'datetime'})).toBe(true);
            expect(isolateScope.isLocation({input: 'location'})).toBe(true);
            expect(isolateScope.isSelect({input: 'select'})).toBe(true);
            expect(isolateScope.isNumber({input: 'number'})).toBe(true);
            expect(isolateScope.isText({input: 'text'})).toBe(true);
            expect(isolateScope.isTextarea({input: 'textarea'})).toBe(true);
            expect(isolateScope.isCheckbox({input: 'checkbox'})).toBe(true);
            expect(isolateScope.isRadio({input: 'radio'})).toBe(true);
            expect(isolateScope.isRelation({input: 'relation'})).toBe(true);
        });

        it('should allow adding and removing of values', function () {
            expect(isolateScope.canAddValue({cardinality: 0})).toBe(true);

            $scope.post.values.test = [1,2];
            expect(isolateScope.canAddValue({cardinality: 1, key: 'test'})).toBe(false);

            expect(isolateScope.canRemoveValue({key: 'test'})).toBe(true);

            isolateScope.addValue({key: 'test'});
            expect($scope.post.values.test.length).toEqual(3);

            isolateScope.removeValue({key: 'test'});
            expect($scope.post.values.test.length).toEqual(2);
        });
    });
});
