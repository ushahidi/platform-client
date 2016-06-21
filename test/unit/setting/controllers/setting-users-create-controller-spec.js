var ROOT_PATH = '../../../../';

describe('setting users create controller', function () {

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

        testApp.controller('settingUsersCreateController', require(ROOT_PATH + 'app/setting/users/controllers/setting-users-create-controller.js'));

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
        $controller('settingUsersCreateController', {
            $scope: $scope,
            $route: {reload: function () {}}
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
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
        expect($scope.processing).toBe(false);
    });

});
