var ROOT_PATH = '../../../../';

describe('Post detail controller', function () {
    var $scope,
       $controller,
       PostEndpoint,
       Notify,
       FormEndpoint;

    var mockFormEndpoint = {
        get: function (parameters, success, error) {
            return success({name: 'test form'});
        }
    };

    var mockFormStageEndpoint = {
        get: function (parameters, success, error) {
            return success({
                results: [
                    {id: 1}
                ]
            });
        }
    };

    function moment() {
        return {
            isSame: function () {},
            fromNow: function () {},
            format: function () {}
        };
    }

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ushahidi.mock',
            'ngResource',
            'angular-cache',
            'leaflet-directive'
        ])
       .controller('postDetailController', require(ROOT_PATH + 'app/post/controllers/post-detail-controller.js'))
       .service('UserEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/user-endpoint.js'))
       .service('RoleEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/role.js'))
       .service('ConfigEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/config.js'))
       .service('CollectionEndpoint', require(ROOT_PATH + 'app/set/services/endpoints/collection.js'))
       .service('TagEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/tag.js'))
       .service('FormAttributeEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-attributes.js'))
       .service('FormStageEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-stages.js'))
       .service('FormEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-stages.js'))
       .service('Maps', require(ROOT_PATH + 'app/common/services/maps.js'))
       .factory('Leaflet', function () {
           return window.L;
       });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_,
                                _$controller_,
                                _Notify_,
                                _PostEndpoint_,
                                _FormEndpoint_
                               ) {
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        $controller = _$controller_;
        PostEndpoint = _PostEndpoint_;
        FormEndpoint = _FormEndpoint_;
    }));

    beforeEach(function () {
        $controller('postDetailController', {
            $scope: $scope,
            FormEndpoint: mockFormEndpoint,
            FormStageEndpoint: mockFormStageEndpoint,
            post: {
                tags: [],
                form: {
                    id: 1,
                    name: 'test form'
                },
                user: {
                    id: 1
                },
                status: 'draft',
                completed_stages: ['1', '2', '3']
            },
            moment: moment,
            $rootScope: {
                setLayout: function () {}
            }
        });
    });

    it('should set form name correctly', function () {
        expect($scope.form_name).toEqual('test form');
    });

    it('should set form stages', function () {
        expect($scope.stages.length).toEqual(1);
    });
    /*
    it('should set form attributees', function () {
        expect($scope.form_attributes.length).toEqual(1);
    });
    */
    it('should add a completed stage to a post', function () {
        var stage = {id: '4', label: 'Structure'};
        spyOn(PostEndpoint, 'update').and.callThrough();

        expect($scope.post.completed_stages).toEqual(['1', '2', '3']);

        $scope.toggleCompletedStage(stage);
        expect($scope.post.completed_stages).toContain(stage.id);
        expect(PostEndpoint.update).toHaveBeenCalledWith($scope.post);
    });

    it('should remove a completed stage from a post', function () {
        var stage = {id: '3', completed: 'true'};
        spyOn(PostEndpoint, 'update').and.callThrough();

        expect($scope.post.completed_stages).toEqual(['1', '2', '3']);

        $scope.toggleCompletedStage(stage);
        expect($scope.post.completed_stages).toEqual(['1', '2']);
        expect(PostEndpoint.update).toHaveBeenCalledWith($scope.post);
    });

    it('should activate a stage', function () {
        var selectedStage = {id: '1', active: false};
        $scope.activateStageTab(selectedStage);
        expect($scope.visibleStage).toEqual(selectedStage.id);
    });

    it('should set visible stage to 3', function () {
        $scope.setVisibleStage(3);
        expect($scope.visibleStage).toEqual(3);
    });

    it('should show the current published state as draft', function () {
        expect($scope.publishedFor()).toEqual('post.publish_for_you');
    });

    it('should show type as false for point and geometry but true for other', function () {
        expect($scope.showType('point')).toEqual(false);
        expect($scope.showType('geometry')).toEqual(false);
        expect($scope.showType('other')).toEqual(true);
    });

    it('should publish a post to a given role', function () {
        spyOn(Notify, 'notify');

        $scope.post.id = 'pass';
        $scope.publishPostTo($scope.post);
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to publish a post to a given role', function () {
        spyOn(Notify, 'apiErrors');

        $scope.post.id = 'fail';
        $scope.publishPostTo($scope.post);
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

    it('should fail to publish a post to a given role when a required stage is not completed', function () {
        spyOn(Notify, 'errorsPretranslated');

        $scope.post.id = 'pass';
        $scope.stages = [{
            required: true
        }];
        $scope.post.completed_stages = [];

        $scope.publishPostTo($scope.post);
        expect(Notify.errorsPretranslated).toHaveBeenCalled();
    });

    /* @todo test in post actions
    it('should delete a post', function () {
        spyOn(Notify, 'notify');

        $scope.post.id = 'pass';
        $scope.deletePost();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to delete a post', function () {
        spyOn(Notify, 'apiErrors');

        $scope.post.id = 'fail';
        $scope.deletePost();

        expect(Notify.apiErrors).toHaveBeenCalled();
    });
     */

    it('should toggle stage completion and attempt to update post', function () {
        spyOn(Notify, 'notify');
        spyOn(Notify, 'apiErrors');

        $scope.post.id = 'pass';
        $scope.post.completed_stages = [];

        $scope.toggleCompletedStage({id: 1});
        expect($scope.post.completed_stages.length).toEqual(1);

        $scope.toggleCompletedStage({id: 1});
        expect($scope.post.completed_stages.length).toEqual(0);

        expect(Notify.notify).toHaveBeenCalled();

        $scope.post.id = 'fail';
        $scope.toggleCompletedStage({id: 1});
        expect(Notify.apiErrors).toHaveBeenCalled();
    });
});
