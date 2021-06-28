describe('setting users edit controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $transition$,
        $controller;

    beforeEach(function () {
        var testApp = makeTestApp();

        testApp.controller('settingUsersEditController', require('app/settings/users/edit.controller.js'));
        testApp.service('$transition$', function () {
                return {
                    'params': function () {
                        return {
                            'id': '1'
                        };
                    }
                };
            });
        testApp.service('$state', function () {
            return {
                'go': function () {
                    return {};
                }
            };
        });
        angular.mock.module('testApp');


    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Notify_, _Session_, _$transition$_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();
        $transition$ = _$transition$_;

        $rootScope.goBack = function () {};
        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
        $scope.setValid = function(valid) {
            $scope.form = {$valid: valid};
        }
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

        expect($scope.isValid).toBe(false);
        expect($scope.saving_user).toBe(false);
        expect(Notify.notify).not.toHaveBeenCalled();
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
