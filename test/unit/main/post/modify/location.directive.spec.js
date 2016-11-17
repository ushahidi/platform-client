var L = require('leaflet');
// Load leaflet plugins here too
require('imports?L=leaflet!leaflet.markercluster');
require('imports?L=leaflet!leaflet.locatecontrol/src/L.Control.Locate');

describe('post location directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element,
        Geocoding,
        Maps,
        map,
        marker;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        Maps = {
            createMap: function () {},
            pointIcon: function () {}
        };

        var testApp = makeTestApp();

        testApp.directive('postLocation', require('app/main/posts/modify/location.directive'))
        .service('Leaflet', () => {
            return L;
        })
        .service('Maps', () => {
            return Maps;
        })
        .value('Geocoding', {
            search: function (searchLocationTerm) {}
        })
        ;

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _Geocoding_, _Maps_, $q) {
        $rootScope = _$rootScope_;
        Notify = _Notify_;
        Geocoding = _Geocoding_;

        map = L.map(document.createElement('div'));
        marker = L.marker([7,7]);
        spyOn(Maps, 'createMap').and.returnValue($q.when(map));
        spyOn(map, 'setView').and.callThrough();
        spyOn(L, 'marker').and.returnValue(marker);
        spyOn(marker, 'setLatLng').and.callThrough();
        spyOn(marker, 'addTo').and.callThrough();

        $scope = _$rootScope_.$new();
        $scope.model = {
            lat: 3,
            lon: 4
        };

        element = '<post-location attribute="attribute" key="key" model="model" id="1"></post-location>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
    }));

    describe('test directive functions', function () {
        it('should init map', function () {
            expect(Maps.createMap).toHaveBeenCalled();
            expect(L.marker).toHaveBeenCalled();
            expect(marker.addTo).toHaveBeenCalledWith(map);
        });

        it('should not clear search location term for failed searches', function () {
            isolateScope.$apply(function () {
                isolateScope.searchLocationTerm = 'Lorem';
            });

            spyOn(Geocoding, 'search').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback(false);
                    }
                };
            });

            isolateScope.searchLocation();
            expect(isolateScope.searchLocationTerm).toEqual('Lorem');
        });

        it('should clear search location term for successful searches', function () {

            isolateScope.$apply(function () {
                isolateScope.searchLocationTerm = 'Ipsum';
            });

            spyOn(Geocoding, 'search').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback([1,2]);
                    }
                };
            });

            isolateScope.searchLocation();
            expect(isolateScope.searchLocationTerm).toEqual('');
        });

        it('should call update model, marker position and map center', function () {
            spyOn(Geocoding, 'search').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback([1, 2]);
                    }
                };
            });

            isolateScope.searchLocation();

            expect(isolateScope.model.lat).toEqual(1);
            expect(isolateScope.model.lon).toEqual(2);
            expect(marker.setLatLng).toHaveBeenCalledWith([1, 2]);
            expect(map.setView).toHaveBeenCalledWith([1, 2], 8);
        });

        it('should clear scope model, and remove the marker', function () {

            isolateScope.$apply(function () {
                isolateScope.model = { lat: 100, lng: 200 };
            });

            isolateScope.clear();

            expect(isolateScope.model).toBeNull();
            expect(marker.remove).toBeCalled;
        });
    });

});
