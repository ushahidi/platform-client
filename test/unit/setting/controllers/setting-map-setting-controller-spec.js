var ROOT_PATH = '../../../../';

describe('setting map settings controller', function () {

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

        testApp.controller('settingMapSettingsController', require(ROOT_PATH + 'app/setting/controllers/setting-map-settings.js'));

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
        spyOn($rootScope, '$emit').and.callThrough();

        $controller('settingMapSettingsController', {
           $scope: $scope,
           leafletEvents: {},
           $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();

    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
    });

    it('should set markers', function () {
        expect($scope.markers.dragger.lat).toEqual(-1.3048035);
    });

    it('should set min and max zoom level', function () {
        expect($scope.minZoom).toEqual(0);
        expect($scope.maxZoom).toEqual(0);
    });

    it('should set centre', function () {
        expect($scope.center.lat).toEqual(-1.3048035);
    });

    it('should update config', function () {
        spyOn(Notify, 'showNotificationSlider');
        //TODO: make configendpoint more general
        $scope.updateConfig('map', {providers:{pass: true}});

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

});
