var ROOT_PATH = '../../../../';

describe('user profile controller', function(){

    var $rootScope,
        $scope,
        $controller,
        mockUserEndpoint,
        mockNotify,
        mockUserGetResponse;

    beforeEach(function(){
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .config(require(ROOT_PATH + 'app/locale-config.js'))
        .controller('userProfileController', require(ROOT_PATH + 'app/user/controllers/user-profile-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $controller = _$controller_;
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
            $routeParams: {id: '2'},
            UserEndpoint: mockUserEndpoint
        });

        getDeferred.resolve(mockUserGetResponse);
        $rootScope.$digest();
    }));


    describe('getRole', function(){
        beforeEach(function(){
            $scope.roles = [
            {
                name: 'guest',
                display_name: 'Guest',
            },
            {
                name: 'user',
                display_name: 'Member',
            },
            {
                name: 'admin',
                display_name: 'Admin',
            }
            ];
        });
    });

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
