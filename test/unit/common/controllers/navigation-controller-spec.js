var ROOT_PATH = '../../../../';

describe('navigation controller', function () {

    var $rootScope,
        $scope;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        // .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('navigationController', require(ROOT_PATH + 'app/common/controllers/navigation.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        var mockAuthenticationService = {
            logout: function (username, password) {
                return {};
            }
        };

        var successCallback = function () {
          return {name: 'test'};
        };

        var mockBootstrapConfig = {};

        var mockConfigEndpoint = {
            get: function (id) {
                return {$promise: {
                    then: function(successCallback, failureCallBack) {
                        successCallback();
                    }
                }};
            }
        };
        $controller('navigationController', {
            $rootScope: $rootScope,
            Authentication: mockAuthenticationService,
            ConfigEndpoint: mockConfigEndpoint,
            BootstrapConfig: mockBootstrapConfig,
            $scope: $scope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should change collection open bool', function () {
        $scope.collectionIsOpen();
        expect($scope.collectionOpen.data).toEqual(true);
    });

    it('should respond to event:update:header', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        spyOn($scope, 'reloadSiteConfig');
        $rootScope.$emit('event:update:header');
        expect($scope.reloadSiteConfig).toHaveBeenCalled();
    });

    it('should respond to $routeChangeSuccess', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('$routeChangeSuccess');
        expect($scope.isHome).toEqual(false);
    });

    it('should set isHome to true when original path is /', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        var mockCurrent = {
            $$route: {
                originalPath: '/'
            }
        };
        $rootScope.$emit('$routeChangeSuccess', mockCurrent);
        expect($scope.isHome).toEqual(true);
    });
});
