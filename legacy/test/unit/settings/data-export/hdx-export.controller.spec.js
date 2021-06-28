// describe('hdx-export-controller', function () {
//
//     var  $scope,
//         $rootScope,
//         $controller,
//         $location,
//         HxlExport;
//
//     beforeEach(function () {
//         var testApp = makeTestApp();
//         testApp.controller('hdx-export-controller', require('app/settings/data-export/hdx-export.controller.js'));
//
//         angular.mock.module('testApp');
//     });
//
//     beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _$location_, _HxlExport_) {
//         $rootScope = _$rootScope_;
//         $controller = _$controller_;
//         $scope = _$rootScope_.$new();
//         $location = _$location_;
//
//
//         $rootScope.hasPermission = function () {
//             return true;
//         };
//     }));
//
//     beforeEach(function () {
//         $rootScope.setLayout = function () {};
//
//         $controller('hdx-export-controller', {
//             $scope: $scope,
//             $rootScope: $rootScope
//         });
//
//         $rootScope.$digest();
//         $rootScope.$apply();
//     });
//
//     describe('controller-functions', function () {
//         it('should get all available forms with tags', function () {
//
//             // expect(HxlExport.getFormsWithTags).toHaveBeenCalled();
//             // expect($scope.forms.length).toEqual(2);
//         });
//     });
// });
