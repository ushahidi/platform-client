describe('hdx-export-controller', function () {

    var  $scope,
        $rootScope,
        $controller,
        $location,
        FormEndpoint,
        FormAttributeEndpoint;

    beforeEach(function () {
        var testApp = makeTestApp();
        testApp.controller('hdx-export-controller', require('app/settings/data-export/hdx-export.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$location_, _FormEndpoint_, _FormAttributeEndpoint_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
        FormEndpoint = _FormEndpoint_;
        FormAttributeEndpoint = _FormAttributeEndpoint_;
        $location = _$location_;

        $rootScope.hasPermission = function () {
            return true;
        };
    }));

    beforeEach(function () {
        $rootScope.setLayout = function () {};
        $controller('hdx-export-controller', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });
    describe('getForms-function', function () {
        it('should get all available forms', function () {
            spyOn(FormEndpoint, 'queryFresh').and.callThrough();
            $scope.getForms();
            expect(FormEndpoint.queryFresh).toHaveBeenCalled();
            expect($scope.forms.length).toEqual(2);
        });
        it('should call attachAttributes when done fetching forms', function () {
            spyOn($scope, 'attachAttributes');
            $scope.getForms();
            expect($scope.attachAttributes).toHaveBeenCalled();
        });
    });
});
