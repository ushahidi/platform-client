var ROOT_PATH = '../../../../';

describe('Post create controller', function () {
    var $scope,
       $controller,
       PostEndpoint,
       Notify,
       FormEndpoint;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ushahidi.mock',
            'ngResource',
            'angular-cache',
            'leaflet-directive'
        ])
        .value('PostEntity', function () {
            return fixture.load('posts/120.json');
        })
       .controller('postCreateController', require(ROOT_PATH + 'app/post/controllers/post-create-controller.js'))
       .service('Maps', require(ROOT_PATH + 'app/common/services/maps.js'))
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
        $controller('postCreateController', {
            $scope: $scope
        });
    });

   it('should load and set options', function () {
      expect($scope.post.allowed_privileges[0]).toEqual('read');
   });
});
