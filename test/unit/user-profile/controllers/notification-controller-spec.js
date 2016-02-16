var ROOT_PATH = '../../../../';

describe('user-profile notification controller', function () {

    var $rootScope,
        $scope,
        Notify,
        Session,
        $controller;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.controller('notificationController', require(ROOT_PATH + 'app/user-profile/controllers/notification-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_, _Notify_, _Session_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        Notify = _Notify_;
        Session = _Session_;
        $scope = _$rootScope_.$new();

        $rootScope.goBack = function () {};
    }));


    beforeEach(function () {
        spyOn($rootScope, '$emit').and.callThrough();

        $controller('notificationController', {
            $scope: $scope
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should retrieve load and set title', function () {
        expect($rootScope.$emit).toHaveBeenCalled();
    });

    it('should delete notification upon request', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.deleteNotification({id: 'pass'});
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should fail to delete a notification', function () {
        spyOn(Notify, 'showSingleAlert');

        $scope.deleteNotification({id: 'fail'});
        $rootScope.$digest();
        $rootScope.$apply();

        expect(Notify.showSingleAlert).toHaveBeenCalled();
    });

    it('should update a contact', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.saveContact({id: 'pass'});

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should fail to update a contact', function () {
        spyOn(Notify, 'showSingleAlert');

        $scope.saveContact({id: 'fail'});

        expect(Notify.showSingleAlert).toHaveBeenCalled();
    });

    it('should save a contact', function () {
        spyOn(Notify, 'showNotificationSlider');

        $scope.saveContact({name: 'pass'});

        expect(Notify.showNotificationSlider).toHaveBeenCalled();
    });

    it('should fail to save a contact', function () {
        spyOn(Notify, 'showSingleAlert');

        $scope.saveContact({name: 'fail'});

        expect(Notify.showSingleAlert).toHaveBeenCalled();
    });

    // These two test should be covered by e2e tests
    it('should change contact', function () {
        $scope.contactHasChanged('something');
    });

    it('should cancel edit', function () {
        $scope.cancelContactEdit('something');
    });
});
