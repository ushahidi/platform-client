describe('setting data import controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingDataImportController', require('app/settings/data-import/data-import.controller.js'));

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
        $rootScope.setLayout = function () {};
        $controller('settingDataImportController', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $rootScope.setLayout = function () {};

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve forms and set them', function () {
        expect($scope.forms[0].name).toEqual('test form');
    });

});
