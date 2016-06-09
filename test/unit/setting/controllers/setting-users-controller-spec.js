var ROOT_PATH = '../../../../';

describe('setting users controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingUsersController', require(ROOT_PATH + 'app/setting/users/controllers/setting-users-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
    }));


    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();
        $rootScope.setLayout = function () {};
        $controller('settingUsersController', {
            $scope: $scope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
    });

    it('should retrieve the users', function () {
        $scope.getUsersForPagination();
        expect($scope.users.length).toEqual(1);
    });

    it('should toggle selected users', function () {
        $scope.toggleUser({id: 1});
        expect($scope.selectedUsers.indexOf(1)).not.toBeLessThan(0);

        $scope.toggleUser({id: 1});
        expect($scope.selectedUsers.indexOf(1)).toBeLessThan(0);
    });

    it('should delete users upon request', function () {
        spyOn(Notify, 'notify');
        $scope.toggleUser({id: 1});

        $scope.deleteUsers();
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to delete the user itself', function () {
        spyOn(Notify, 'error');
        $scope.toggleUser({id: 1});
        Session.setSessionData({'userId': 1});
        $scope.deleteUsers();
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.error).toHaveBeenCalled();
    });

    it('should change the roles of selected users', function () {
        spyOn(Notify, 'notify');
        $scope.toggleUser({id: 'pass'});

        $scope.changeRole('admin');
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to change the roles of selected users and return an error', function () {
        spyOn(Notify, 'apiErrors');

        // Cause UserEndpoint to return fail
        $scope.toggleUser({id: 'fail'});

        $scope.changeRole('admin');
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.apiErrors).toHaveBeenCalled();
    });

    it('should set items per page and call getUsersForPagination', function () {
        spyOn($scope, 'getUsersForPagination');
        $scope.itemsPerPageChanged(5);

        expect($scope.itemsPerPage).toEqual(5);
        expect($scope.getUsersForPagination).toHaveBeenCalled();
    });

});
