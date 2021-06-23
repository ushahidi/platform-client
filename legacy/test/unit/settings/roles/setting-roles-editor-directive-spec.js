describe('setting roles editor directive', function () {

    var $rootScope,
        $scope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('rolesEditor', require('app/settings/roles/editor.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})
        .service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        });
        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $scope.$resolve = {
            $transition$: {
                params: function () {
                    return {id: 1};
                }
            }
        };
        Notify = _Notify_;

        element = '<div roles-editor></div>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should to save a role', function () {
        spyOn(Notify, 'notify');

        $scope.saveRole({id: 'pass', name: 'admin'});

        expect(Notify.notify).toHaveBeenCalled();
    });

});
