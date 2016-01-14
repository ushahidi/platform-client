var ROOT_PATH = '../../../../';

describe('navigation controller', function () {

    var $rootScope,
        $scope,
        $controller,
        ConfigEndpoint,
        BootstrapConfig;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
            'pascalprecht.translate',
            'ngResource',
            'angular-cache'
        ])
        .controller('navigationController', require(ROOT_PATH + 'app/common/controllers/navigation.js'))
        .service('ConfigEndpoint', require(ROOT_PATH + 'app/common/services/endpoints/config.js'))
        .factory('BootstrapConfig', function () {
            return {
                private: true
            };
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_,
                                _$controller_,
                                _ConfigEndpoint_,
                                 _BootstrapConfig_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        ConfigEndpoint = _ConfigEndpoint_;
        BootstrapConfig = _BootstrapConfig_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        $controller('navigationController', {
            $rootScope: $rootScope,
            $scope: $scope,
            Authentication: {}
        });
    });

    describe('private deployment', function () {
        it('should not allow a user to register on a private deployment', function () {
            expect($scope.site.private).toBe(true);
            expect($scope.canRegister()).toBe(false);
        });

        it('should not allow a non-logged in user to create a post on a private deployment', function () {
            $scope.loggedin = false;

            expect($scope.site.private).toBe(true);
            expect($scope.canCreatePost()).toBe(false);
        });
    });
});
