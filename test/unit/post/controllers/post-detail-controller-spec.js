var ROOT_PATH = '../../../../';

describe('Post detail controller', function () {
    var $scope,
       $controller,
       PostEndpoint;

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
       .service('FormEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form.js'))
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
                                _PostEndpoint_
                               ) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        PostEndpoint = _PostEndpoint_;
    }));

    beforeEach(function () {
        $controller('postDetailController', {
            $scope: $scope,
            post: {
                tags: [],
                form: {
                    id: 1
                },
                completed_stages: ['1', '2', '3']
            }
        });
    });

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
});
