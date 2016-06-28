var ROOT_PATH = '../../../../';

describe('setting data mapper controller', function () {

    var $rootScope,
        $scope,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingDataMapperController', require(ROOT_PATH + 'app/setting/controllers/setting-data-mapper-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();

        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
    }));


    beforeEach(function () {
        $rootScope.setLayout = function () {};
        $controller('settingDataMapperController', {
            $scope: $scope,
            initialData: {form: 1, csv: 1},
            $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve and set initalData', function () {
        expect($scope.form).toEqual(1);
        expect($scope.csv).toEqual(1);
    });

});
