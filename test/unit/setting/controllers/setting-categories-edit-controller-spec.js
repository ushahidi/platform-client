var ROOT_PATH = '../../../../';

describe('setting categories edit controller', function () {

    var $rootScope,
        $scope,
        Notify,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('settingCategoriesEditController', require(ROOT_PATH + 'app/setting/controllers/setting-categories-edit-controller.js'))


        .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'))
        .service('multiTranslate', require(ROOT_PATH + 'app/common/services/multi-translate.js'))
        .run(require(ROOT_PATH + 'app/common/global/event-handlers.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        $scope = _$rootScope_.$new();
    }));


    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();
        spyOn($rootScope, 'goBack').and.callThrough();
        
        var mockRouteParams = {
            id: 1
        };

        $controller('settingCategoriesEditController', {
           $scope: $scope,
           $rootScope: $rootScope,
           $routeParams: mockRouteParams
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($scope.$emit).toHaveBeenCalled();
    });

    it('should save a tag and update the path', function () {
        spyOn(Notify, 'showNotificationSlider');
        $scope.saveTag({id:'pass'});
        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should show an error on save failure', function () {
        spyOn(Notify, 'showApiErrors');
        $scope.saveTag({id :'fail'});
        expect(Notify.showApiErrors).toHaveBeenCalled();
    });
});
