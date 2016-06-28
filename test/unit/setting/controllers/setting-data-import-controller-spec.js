var ROOT_PATH = '../../../../';

describe('setting data import controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingDataImportController', require(ROOT_PATH + 'app/setting/controllers/setting-data-import-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_) {
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
