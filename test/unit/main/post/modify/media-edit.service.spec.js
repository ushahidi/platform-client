var ROOT_PATH = '../../../../../';

describe('Media Edit Service', function () {

    var MediaEditService,
        tasks,
        attributes,
        post,
        $rootScope;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');
        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);
        testApp.service('MediaEditService', require(ROOT_PATH + 'app/main/posts/modify/media-edit.service.js'))
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config.js')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _MediaEditService_, _$window_) {
        $rootScope = _$rootScope_;
        MediaEditService = _MediaEditService_;

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


    });
});
