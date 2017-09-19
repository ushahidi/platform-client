describe('setting categories edit controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('settingCategoriesEditController', require('app/settings/categories/edit.controller.js'))

        .run(require('app/common/global/event-handlers.js'));

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

        spyOn($rootScope, '$emit').and.callThrough();

        $controller('settingCategoriesEditController', {
            $scope: $scope,
            $rootScope: $rootScope,
            $routeParams: {id: 1}
        });

        $rootScope.$digest();
        $rootScope.$apply();

    });

    it('should save a tag and update the path', function () {
        spyOn(Notify, 'notify');
        $scope.saveCategory({id: 'pass'});
        $rootScope.$digest();
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should show an error on save failure', function () {
        spyOn(Notify, 'apiErrors');
        $scope.saveCategory({id: 'fail'});
        $rootScope.$digest();
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

    it('should return requested parent-tag', function () {
        $scope.addParent(1).$promise.then(function (parent) {
            expect(parent.id).toEqual(1);
            expect(parent.tag).toEqual('test tag');
        });
    });

    it('should return parent-name', function () {
        $scope.parents = [{
            id: 1,
            tag: 'parent'
        }];
        var parent = $scope.getParentName();
        expect(parent).toEqual('Nothing');
        $scope.category.parent_id = 1;
        parent = $scope.getParentName();
        expect(parent).toEqual('parent');
    });

});
