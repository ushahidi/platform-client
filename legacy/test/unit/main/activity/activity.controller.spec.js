describe('activity activity controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp()
        .service('ViewHelper', function () {
            return {
                isViewAvailable: function (view) {
                    return true;
                }
            };
        });

        testApp.controller('activityController', require('app/main/activity/activity.controller.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        $rootScope.goBack = function () {};
    }));


    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();

        $controller('activityController', {
            $scope: $scope,
            dc: { units: { ordinals: 1 } },
            $routeParams: {view: 'list'}
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
    });
});
