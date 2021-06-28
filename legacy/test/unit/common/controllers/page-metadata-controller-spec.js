describe('page-metadata controller', function () {

    var $rootScope,
        $controller,
        $scope;

    var mockWindow = {
        ushahidi: {
            appStoreId: 'test'
        }
    };

    beforeEach(function () {
        makeTestApp()
        .value('$window', mockWindow)
        .controller('pageMetadataController', require('app/common/controllers/page-metadata.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_) {
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

        var mockConfigEndpoint = {
            get: function (id) {
                return {$promise: {
                    then: function () {
                        return {name: 'test'};
                    }
                }};
            }
        };
        $controller('pageMetadataController', {
            $rootScope: $rootScope,
            Authentication: mockAuthenticationService,
            ConfigEndpoint: mockConfigEndpoint,
            BootstrapConfig: mockBootstrapConfig,
            $scope: $scope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should respond to event:update:header', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        spyOn($scope, 'reloadSiteConfig');
        $rootScope.$emit('event:update:header');
        expect($scope.reloadSiteConfig).toHaveBeenCalled();
    });

    it('should respond to setPageTitle', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('setPageTitle', 'test title');
        expect($scope.pageTitle).toEqual('test title - ');
    });

    it('should respond to setPageDescription', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('setPageDescription', 'test description');
        expect($scope.pageDescription).toEqual('test description');
    });

    it('should respond to setPageKeywords', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('setPageKeywords', 'test keywords');
        expect($scope.pageKeywords).toEqual('test keywords');
    });

    it('should respond to setPageRobots', function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.$emit('setPageRobots', true);
        expect($scope.pageRobots).toEqual('index, follow');

        // TODO: retest
        //$rootScope.$emit('setPageRobots', false);
        //expect($scope.pageRobots).toEqual('noindex, nofollow');

        $rootScope.$emit('setPageRobots', 'other');
        expect($scope.pageRobots).toEqual('other');
    });
});
