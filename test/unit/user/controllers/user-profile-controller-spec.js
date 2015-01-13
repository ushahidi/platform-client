var ROOT_PATH = '../../../../';

describe('user profile controller', function(){

    var $rootScope,
        $scope,
        $controller,
        RoleHelper,
        mockUserEndpoint,
        mockNotify,
        mockUserGetResponse;

    beforeEach(function(){
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'))
        .config(require(ROOT_PATH + 'app/locale-config.js'))
        .controller('userProfileController', require(ROOT_PATH + 'app/user/controllers/user-profile-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function(_$rootScope_, _$controller_, _RoleHelper_){
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        RoleHelper = _RoleHelper_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(inject(function($q){
        mockNotify = {
            showAlerts: function(/*alerts*/) {}
        };

        mockUserGetResponse = {
            'id': 2,
            'url': 'http://ushahidi-backend/api/v2/users/2',
            'email': 'admin@22dsad.com',
            'realname': 'dasda',
            'username': 'admin',
            'role': 'admin'
        };

        var getDeferred = $q.defer();
        mockUserEndpoint = {
            get: function() {
                return {$promise: getDeferred.promise};
            }
        };

        spyOn(mockUserEndpoint, 'get').and.callThrough();

        $controller('userProfileController', {
            $scope: $scope,
            Notify: mockNotify,
            RoleHelper: RoleHelper,
            $routeParams: {id: '2'},
            UserEndpoint: mockUserEndpoint
        });

        getDeferred.resolve(mockUserGetResponse);
        $rootScope.$digest();
    }));

    var returnedRole;

    describe('with an existing role name', function(){
        beforeEach(function(){
            returnedRole = $scope.getRole('guest');
        });

        it('should return the display_name for the role name', function(){
            expect(returnedRole).toEqual('Guest');
        });
    });

    describe('with an non existing role name', function(){
        beforeEach(function(){
            returnedRole = $scope.getRole('foo');
        });

        it('should return the value of the input role', function(){
            expect(returnedRole).toEqual('foo');
        });
    });
});
