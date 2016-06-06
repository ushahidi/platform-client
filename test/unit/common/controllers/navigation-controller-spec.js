var ROOT_PATH = '../../../../';

describe('navigation controller', function () {

    var $rootScope,
        $controller,
        $scope,
        mockConfigEndpoint,
        navigationController;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ushahidi.mock',
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

        var mockBootstrapConfig = {};

        mockConfigEndpoint = {
            get: function (id) {
                return {$promise: {
                    then: function (successCallback, failureCallBack) {
                        successCallback();
                    }
                }};
            }
        };
        spyOn(mockConfigEndpoint, 'get').and.callThrough();

        navigationController = $controller('navigationController', {
            $rootScope: $rootScope,
            Authentication: mockAuthenticationService,
            ConfigEndpoint: mockConfigEndpoint,
            BootstrapConfig: mockBootstrapConfig
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should respond to event:update:header', function () {
        //spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('event:update:header');
        expect(mockConfigEndpoint.get).toHaveBeenCalledWith({ id: 'site' });
    });
});
