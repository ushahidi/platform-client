var ROOT_PATH = '../../../../';

describe('Post detail controller', function () {
    var $scope,
       $controller,
       PostEndpoint,
       FormEndpoint;

    var mockFormEndpoint = {
        get: function(parameters, success, error) {
            return success({name: 'test form'});
        }
    };

    var mockFormStageEndpoint = {
        get: function(parameters, success, error) {
            return success({
                results: [
                    {id: 1}
                ]
            });
        }
    };

   beforeEach(function () {
        
        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ngResource',
            'angular-cache',
            'leaflet-directive'
        ])
       .controller('postDetailController', require(ROOT_PATH + 'app/post/controllers/post-detail-controller.js'))
       .service('PostEndpoint', require(ROOT_PATH + 'app/post/services/endpoints/post-endpoint.js'))
       .service('UserEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/user-endpoint.js'))
       .service('ConfigEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/config.js'))
       .service('CollectionEndpoint', require(ROOT_PATH + 'app/set/services/endpoints/collection.js'))
       .service('TagEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/tag.js'))
       .service('FormAttributeEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-attributes.js'))
       .service('FormStageEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-stages.js'))
       .service('FormEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-stages.js'))
       .service('Maps', require(ROOT_PATH + 'app/common/services/maps.js'))
       .service('Notify', require(ROOT_PATH + 'app/common/services/notify.js'))
       .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'))
       .factory('Leaflet', function () {
           return window.L;
       });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_,
                                _$controller_,
                                _PostEndpoint_,
                                _FormEndpoint_
                               ) {
        $scope = _$rootScope_.$new();
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
                    id: 1
                },
                user: {
                    id: 1
                },
                status: 'draft',
                completed_stages: ['1', '2', '3']
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

    it('should publish post for everyone', function () {
        expect($scope.postIsPublishedTo()).toEqual('draft');

        spyOn(PostEndpoint, 'update').and.callThrough();
        $scope.publishRole = '';
        $scope.publishPostTo();

        expect($scope.postIsPublishedTo()).toEqual('');
    });

    it('should show type as false for point and geometry but true for other', function () {
        expect($scope.showType('point')).toEqual(false);
        expect($scope.showType('geometry')).toEqual(false);
        expect($scope.showType('other')).toEqual(true);
    });
/*
    it('should delete a post', function () {
        spyOn(PostEndpoint, 'delete');
        $scope.deletePost();
        expect(PostEndpoint.delete).toHaveBeenCalledWith({ id: $scope.post.id });
    });
    */
});
