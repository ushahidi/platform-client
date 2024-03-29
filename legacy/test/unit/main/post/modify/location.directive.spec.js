var L = require('leaflet');
// Load leaflet plugins here too
require('imports-loader?L=leaflet!leaflet.markercluster');
require('imports-loader?L=leaflet!leaflet.locatecontrol/src/L.Control.Locate');

describe('post location directive', function () {

    var $rootScope,
    $scope,
    isolateScope,
    Notify,
    element,
    Geocoding,
    Maps,
    map,
    marker,
    currentPositionControl,
    ngModel;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        Maps = {
            createMap: function () {},
            pointIcon: function () {}
        };
        currentPositionControl = {
            start: function () {}
        };
        var testApp = makeTestApp();

        testApp.directive('postLocation', require('app/data/common/post-edit-create/location.directive'))
        .service('Leaflet', () => {
            return L;
        })
        .service('Maps', () => {
            return Maps;
        })
        .value('Geocoding', {
            searchAllInfo: function (searchLocationTerm) {}
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
        element = '<post-location attribute="attribute" key="key" ng-model="model" id="1"></post-location>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
        ngModel = element.controller('ngModel');

        spyOn(isolateScope, 'chooseCurrentLocation').and.callThrough();
        spyOn(currentPositionControl, 'start').and.callThrough();
        spyOn(ngModel, '$setViewValue').and.callThrough();
    }));

    describe('test directive functions', function () {
        it('should init map', function () {
            expect(Maps.createMap).toHaveBeenCalled();
            expect(L.marker).toHaveBeenCalled();
            expect(marker.addTo).toHaveBeenCalledWith(map);
        });
        it('should clear search location term when choosing a location', function () {
            isolateScope.$apply(function () {
                isolateScope.searchLocationTerm = 'Ipsum';
            });

            spyOn(Geocoding, 'searchAllInfo').and.callFake(function (kupi) {
                return {
                    then: function (callback) {
                        callback({lat: 1,lon: 2});
                    }
                };
            });

            isolateScope.chooseLocation({lat: 1,lon: 2});
            expect(isolateScope.searchLocationTerm).toEqual('');
        });
        it('should call update model, marker position and map center', function () {
            var newLocation = {
                display_name: 'Lorem',
                lat: 1,
                lon: 2
            };
            spyOn(isolateScope, 'chooseLocation').and.callThrough();
            isolateScope.$apply(function () {
                isolateScope.searchResults = [newLocation];
            });
            var elementToClick = element[0].querySelector('.list-item');
            elementToClick.dispatchEvent(new Event('click'));
            expect(isolateScope.chooseLocation).toHaveBeenCalledWith(newLocation);
            expect(ngModel.$setViewValue).toHaveBeenCalledWith({
                lat: 1,
                lon: 2
            });
            expect(ngModel.$viewValue.lat).toEqual(1);
            expect(ngModel.$viewValue.lon).toEqual(2);
            expect(marker.setLatLng).toHaveBeenCalledWith([1, 2]);
            expect(map.setView).toHaveBeenCalledWith([1, 2], 8);
        });
        it('should clear scope model, and remove the marker', function () {
            isolateScope.$apply(function () {
                ngModel.$setViewValue({ lat: 100, lng: 200 });
            });

            isolateScope.clear();

            expect(ngModel.$viewValue).toBeNull();
            expect(marker.remove).toBeCalled;
        });
        it('should start checking for current location', function () {
            var elementToClick = element[0].querySelector('.button-beta');
            elementToClick.dispatchEvent(new Event('click'));
            isolateScope.chooseCurrentLocation();
            expect(isolateScope.chooseCurrentLocation).toHaveBeenCalled();
            expect(currentPositionControl.start).toBeCalled;
        });
    });
});
