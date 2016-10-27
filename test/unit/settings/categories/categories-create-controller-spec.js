describe('setting categories create controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingCategoriesCreateController', require('app/settings/categories/create.controller.js'))

        ;

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

        $controller('settingCategoriesCreateController', {
            $scope: $scope,
            $route: {reload: function () {}}
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($scope.$emit).toHaveBeenCalled();
    });

    it('should save a tag and update the path', function () {
        spyOn(Notify, 'notify');
        $scope.saveCategory({id: 'pass'});
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should show an error on save failure', function () {
        spyOn(Notify, 'apiErrors');
        $scope.saveCategory({id: 'fail'});
        expect(Notify.apiErrors).toHaveBeenCalled();
    });
});
