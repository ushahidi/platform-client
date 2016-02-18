var ROOT_PATH = '../../../../';

describe('Post edit controller', function () {
    var $scope,
       $controller,
       PostEndpoint,
       FormEndpoint;

    var mockFormEndpoint = {
        get: function (parameters, success, error) {
            return success({name: 'test form'});
        }
    };

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ngResource',
            'angular-cache',
            'leaflet-directive'
        ])
       .controller('postEditController', require(ROOT_PATH + 'app/post/controllers/post-edit-controller.js'))
       .service('PostEndpoint', require(ROOT_PATH + 'app/post/services/endpoints/post-endpoint.js'))
       .service('FormEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/form-stages.js'));

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

        $controller('postEditController', {
            $scope: $scope,
            FormEndpoint: mockFormEndpoint,
            post: {
                tags: [],
                form: {
                    id: 1
                },
                user: {
                    id: 1
                },
                title: 'test',
                status: 'draft',
                completed_stages: ['1', '2', '3']
            }
        });
    });

    it('should set post correctly', function () {
        expect($scope.post.title).toEqual('test');
    });
});
