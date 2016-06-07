var ROOT_PATH = '../../../../';

describe('setting categories controller', function () {

    var $rootScope,
        $scope,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingCategoriesController', require(ROOT_PATH + 'app/setting/controllers/setting-categories-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
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

});
