describe('hdx-export-controller', function () {

    var  $scope,
        $rootScope,
        $controller;

    beforeEach(function () {
        var testApp = makeTestApp();
        testApp.controller('hdx-export-controller', require('app/settings/data-export/hdx-export.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();

        $rootScope.hasPermission = function () {
            return true;
        };
    }));

    beforeEach(function () {
        $controller('hdx-export-controller', {
            $scope: $scope,
            $rootScope: $rootScope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });
    describe ('controller', function () {
        it('should be true', function () {
            $scope.thisIsTrue = true;
            expect($scope.thisIsTrue).toEqual(true);
        });
    });
});
