describe('setting datasources controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingDataSourcesController', require('app/settings/datasources/datasources.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Notify_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        $scope = _$rootScope_.$new();

        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
    }));


    beforeEach(function () {
        spyOn($scope, '$emit').and.callThrough();
        $rootScope.setLayout = function () {};

        $controller('settingDataSourcesController', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $scope.forms = {
            'pass': {
                $valid: true
            },
            'fail': {
                $valid: true
            }
        };

        $rootScope.$digest();
        $rootScope.$apply();

    });

    it('should retrieve load and set title', function () {
        expect($scope.$emit).toHaveBeenCalled();
    });

    it('should save provider settings successfully', function () {
        spyOn(Notify, 'notify');

        $scope.saveProviderSettings('pass');
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should open the providers accordion group to show errors when form is invalid', function () {
        $scope.forms.pass.$valid = false;

        $scope.saveProviderSettings('pass');
        expect($scope.formsSubmitted.pass).toBe(true);
    });

    it('should show an error on save failure', function () {
        spyOn(Notify, 'apiErrors');
        $scope.saveProviderSettings('fail');
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

});
