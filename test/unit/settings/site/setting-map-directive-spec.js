var L = require('leaflet');
describe('setting map directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        element,
        Leaflet,
        Maps,
        map,
        marker;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        var testApp = makeTestApp();

        testApp.directive('settingsMap', require('app/settings/site/map.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})
        .value('Leaflet', L);

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Maps_, _Leaflet_, $q) {
        $rootScope = _$rootScope_;
        Leaflet = _Leaflet_;
        $scope = _$rootScope_.$new();
        $scope.map = {};

        Maps = _Maps_;
        spyOn(Maps, 'createMap').and.returnValue({
            then: (cb) => {
                cb(map);
            }
        });
        spyOn(Maps, 'getConfig').and.returnValue($q.when({
            default_view: {
                lat: 3,
                lon: 4,
                zoom: 10
            },
            clustering: false
        }));
        map = L.map(document.createElement('div'), {
            center: [0,1],
            zoom: 5,
            layers: [L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png')]
        });
        marker = L.marker([7,7]);
        spyOn(map, 'setView').and.callThrough();
        spyOn(L, 'marker').and.returnValue(marker);
        spyOn(marker, 'setLatLng').and.callThrough();
        spyOn(marker, 'addTo').and.callThrough();

        element = '<settings-map config="map"></settings-map>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should create a map', function () {
        expect(Maps.createMap).toHaveBeenCalled();
        expect(L.marker).toHaveBeenCalled();
        expect(marker.addTo).toHaveBeenCalledWith(map);
    });

    it('should set scope.config to map config', function () {
        expect(isolateScope.config).toEqual({
            default_view: {
                lat: 3,
                lon: 4,
                zoom: 10
            },
            clustering: false
        });
    });

    it('should update config when zoom changes', function () {
        map.setZoom(7);
        expect(isolateScope.config.default_view.zoom).toEqual(7);
    });

    it('should update map when zoom changes', function () {
        isolateScope.config.default_view.zoom = 9;
        isolateScope.updateMapPreview();
        expect(map.setView).toHaveBeenCalledWith([3, 4], 9);
    });

    it('should update marker when lat/lon changes', function () {
        isolateScope.config.default_view.lat = 48;
        isolateScope.config.default_view.lon = 36;
        isolateScope.updateMapPreview();
        expect(marker.setLatLng).toHaveBeenCalledWith([48, 36]);
    });

    it('should save position when marker dragged', function () {
    });

});
