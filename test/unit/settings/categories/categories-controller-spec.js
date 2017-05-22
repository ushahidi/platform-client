describe('setting categories controller', function () {

    var $rootScope,
        $scope,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingCategoriesController', require('app/settings/categories/categories.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };
    }));


    beforeEach(function () {
        $controller('settingCategoriesController', {
            $scope: $scope
        });
        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve the categories', function () {
        expect($scope.categories.length).toEqual(1);
    });

    it('should delete tags upon request', function () {
        $scope.selectedCategories = [{id: 1}];
        $scope.deleteCategories();
    });
    it('should delete tag upon request', function () {
        $scope.deleteCategory({id: 1});
    });

});
