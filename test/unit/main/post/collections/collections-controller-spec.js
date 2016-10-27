describe('set collections controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $controller;

    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.controller('collectionsController', require('app/main/posts/collections/collections-controller.js'));

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

        $controller('collectionsController', {
            $scope: $scope,
            collection: {
                allowed_privileges: 'update'
            },
            $routeParams: {view: 'list'}
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
    });

    it('should return current view', function () {
        var test = $scope.currentView();

        expect(test).toEqual('list');
    });
});
