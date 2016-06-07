var ROOT_PATH = '../../../../';

describe('setting forms controller', function () {

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

        testApp.controller('settingFormsController', require(ROOT_PATH + 'app/setting/controllers/setting-forms-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$q_, _$rootScope_, _$controller_, _Notify_) {
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
        spyOn($scope, '$emit').and.callThrough();

        $controller('settingFormsController', {
            $scope: $scope,
            $q: $q,
            $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();

    });

    it('should retrieve load and set title', function () {
        expect($scope.$emit).toHaveBeenCalled();
    });

    it('should refresh the forms', function () {
        $scope.refreshForms();
        expect($scope.forms[0].name).toEqual('test form');
    });

    it('should open a new form', function () {
        $scope.openNewForm();
        expect($scope.newForm).toEqual({});
        expect($scope.isNewFormOpen).toEqual(true);
    });

    it('should delete a form successfully', function () {
        spyOn(Notify, 'showNotificationSlider');
        $scope.deleteForm({id: 'pass'});
        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should save a form successfully', function () {
        spyOn(Notify, 'showNotificationSlider');
        $scope.saveNewForm({id: 'pass'});
        $rootScope.$digest();
        $rootScope.$apply();


        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

});
