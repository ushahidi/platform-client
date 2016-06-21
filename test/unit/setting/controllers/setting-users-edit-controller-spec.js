var ROOT_PATH = '../../../../';

describe('setting users edit controller', function () {

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

        testApp.controller('settingUsersEditController', require(ROOT_PATH + 'app/setting/users/controllers/setting-users-edit-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        $rootScope.goBack = function () {};

        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
    }));


    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();

        $controller('settingUsersEditController', {
            $scope: $scope,
            $routeParams: {id: 1}
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
    });

    it('should retrieve the user', function () {
        expect($scope.user.id).toEqual(1);
    });

    it('should save users upon request', function () {
        spyOn(Notify, 'notify');

        $scope.saveUser({id: 'pass'});
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.notify).toHaveBeenCalled();
        expect($scope.userSavedUser).toBe(true);
    });

    it('should fail to save a user', function () {
        spyOn(Notify, 'errors');

        $scope.saveUser('fail');
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.errors).toHaveBeenCalled();
    });

});
