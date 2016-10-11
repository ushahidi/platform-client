var ROOT_PATH = '../../../../';

describe('setting roles controller', function () {

    var $rootScope,
        $scope,
        $q,
        Notify,
        $controller;

    beforeEach(function () {
        require('test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingRolesController', require('app/settings/roles/roles.controller.js'));

        require('test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$q_, _$rootScope_, _$controller_, _Notify_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        $controller = _$controller_;
        Notify = _Notify_;
        $scope = _$rootScope_.$new();

        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
    }));


    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();

        $controller('settingRolesController', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();

    });

});
