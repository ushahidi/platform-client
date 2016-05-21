var ROOT_PATH = '../../../../';

describe('setting map directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('settings-map', require(ROOT_PATH + 'app/setting/directives/setting-map-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        element = '<settings-map map="map"></settings-map>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

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

});
