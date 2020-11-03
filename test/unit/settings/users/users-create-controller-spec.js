describe('setting users create controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingUsersCreateController', require('app/settings/users/create.controller.js'));
        testApp.service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        });
        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        $scope.setValid = function(valid) {
            $scope.form = {$valid: valid};
        }

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

    it('should save users upon if correct values is given', function () {
        spyOn(Notify, 'notify');
        $scope.setValid(true);
        $scope.saveUser({id: 'pass'});
        $rootScope.$digest();
        $rootScope.$apply();
        expect(Notify.notify).toHaveBeenCalled();
        expect($scope.userSavedUser).toBe(true);
    });

    it('should fail to save a user', function () {
        spyOn(Notify, 'notify');
        $scope.setValid(false);
        $scope.saveUser('fail');
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.notify).not.toHaveBeenCalled();
        expect($scope.isValid).toBe(false);
        expect($scope.saving_user).toBe(false);
    });

    it('should save users after an error is fixed', function () {
        spyOn(Notify, 'notify');
        // Saving with errors
        $scope.setValid(false);
        $scope.saveUser('fail');
        $rootScope.$digest();
        $rootScope.$apply();

        expect($scope.isValid).toBe(false);
        expect($scope.saving_user).toBe(false);
        expect(Notify.notify).not.toHaveBeenCalled();

        // Saving with corrected values
        $scope.setValid(true);
        $scope.saveUser({id: 'pass'});
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.notify).toHaveBeenCalled();
        expect($scope.userSavedUser).toBe(true);
        expect($scope.isValid).toBe(true);
        expect($scope.saving_user).toBe(false);
    });
});
