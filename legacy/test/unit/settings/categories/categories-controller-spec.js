describe('setting categories controller', function () {

    var $rootScope,
        $scope,
        $controller,
        Notify,
        CategoriesSdk;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingCategoriesController', require('app/settings/categories/categories.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Notify_, _CategoriesSdk_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        CategoriesSdk = _CategoriesSdk_;
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
        spyOn(Notify, 'confirmDelete').and.callThrough();
        spyOn(CategoriesSdk, 'deleteCategory').and.callThrough();

    });

    it('should retrieve the categories', function () {
        $scope.refreshView();
        expect($scope.categories.length).toEqual(2);
    });

    it('should delete tags upon request', function () {
        $scope.selectedCategories = [1];
        $scope.deleteCategories();
        expect(Notify.confirmDelete).toHaveBeenCalled();
        expect(CategoriesSdk.deleteCategory).toHaveBeenCalled();
    });

    it('should delete tag upon request', function () {
        $scope.deleteCategory({id: 1});
        expect(Notify.confirmDelete).toHaveBeenCalled();
        expect(CategoriesSdk.deleteCategory).toHaveBeenCalled();
    });
});
