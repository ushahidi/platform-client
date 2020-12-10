describe('setting categories edit controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller,
        CategoriesSdk;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingCategoriesEditController', require('app/settings/categories/edit.controller.js'))
        .service('$transition$', function () {
            return {
                'params': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        })
        .service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        })
        .run(require('app/common/global/event-handlers.js'));

        angular.mock.module('testApp');

    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Notify_, _CategoriesSdk_) {

        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        CategoriesSdk = _CategoriesSdk_;
        $scope = _$rootScope_.$new();

        $rootScope.hasManageSettingsPermission = function () {
            return true;
        };

    }));

    beforeEach(function () {

        spyOn($rootScope, '$emit').and.callThrough();

        $controller('settingCategoriesEditController', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();
        spyOn(Notify, 'notify').and.callThrough();
        spyOn(CategoriesSdk, 'saveCategory').and.callThrough();

    });

    it('should save a tag and update the path', function () {
        $scope.saveCategory();
        expect(Notify.notify).toHaveBeenCalled();
        expect(CategoriesSdk.saveCategory).toHaveBeenCalled();
    });

    it('should show an error on save failure', function () {
        spyOn(Notify, 'apiErrors');
        $scope.category.id = 'fail';
        $scope.saveCategory();
        $rootScope.$digest();
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

    it('should return parent-name', function () {
        const parent = {
            id: 1,
            tag: 'parent'
        }
        $scope.parents = [];
        let parentName = $scope.getParentName();
        expect(parentName).toEqual('Nothing');
        $scope.parents = [parent];
        $scope.category.parent_id = 1;
        $scope.category.parent = parent;
        parentName = $scope.getParentName();
        expect(parentName).toEqual('parent');
    });
});
