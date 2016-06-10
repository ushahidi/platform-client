var ROOT_PATH = '../../../../';

describe('user-profile notification directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element,
        $compile;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
        'ushahidi.mock'
        ]);

        testApp.directive('notifications', require(ROOT_PATH + 'app/user-profile/directives/notifications.js'))
        .value('$filter', function () {
            return function () {};
        });


        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, _$compile_, _Notify_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Notify = _Notify_;
        $scope = _$rootScope_.$new();

        element = '<notifications><notifications>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should delete notification upon request', function () {
        spyOn(Notify, 'notify');

        isolateScope.deleteNotification({id: 'pass'});

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to delete a notification', function () {
        spyOn(Notify, 'error');

        isolateScope.deleteNotification({id: 'fail'});

        expect(Notify.error).toHaveBeenCalled();
    });

    it('should save contacts', function () {
        spyOn(Notify, 'notify');

        isolateScope.contacts = [
            {
                contact1 : {
                    contact : 'test1@test.com',
                    id : 'pass'
                },
                contact2 : {
                    contact: 'test2@test.com',
                    id : 'pass'
                }
            }
        ];

        isolateScope.contact = {
            contact : {
                contact : 'pass'
            }
        };

        isolateScope.saveContacts();
        $rootScope.$apply();

        expect(Notify.notify).toHaveBeenCalled();
    });
});
