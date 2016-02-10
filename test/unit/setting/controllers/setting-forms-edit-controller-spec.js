var ROOT_PATH = '../../../../';

describe('setting forms edit controller', function () {

    var $rootScope,
        $scope,
        $q,
        Notify,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingFormsEditController', require(ROOT_PATH + 'app/setting/controllers/setting-forms-edit-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$q_, _$rootScope_, _$controller_, _Notify_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        $controller = _$controller_;
        Notify = _Notify_;
        $scope = _$rootScope_.$new();
    }));


    beforeEach(function () {
        $controller('settingFormsEditController', {
           $scope: $scope,
           $q: $q,
           $routeParams: {id: 1},
           $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();

    });

    it('should load forms and stages', function () {
        expect($scope.form.name).toEqual('test form');
    });

});
