var ROOT_PATH = '../../../../';

describe('role helper', function () {

    var RoleHelper;

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'))
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_RoleHelper_) {
        RoleHelper = _RoleHelper_;
    }));

    describe('some existing role names', function () {
        var existingRoles;

        beforeEach(function () {
            existingRoles = [
                {
                    name: 'admin',
                    display_name: 'Admin'
                }
            ];
        });

        describe('returned role', function () {

            var returnedRole;

            describe('with an existing role name', function () {

                beforeEach(function () {
                    returnedRole = RoleHelper.getRole('admin', existingRoles);
                });

                it('should return the display_name for the role name', function () {
                    expect(returnedRole).toEqual('Admin');
                });
            });

            describe('with an non existing role name', function () {
                beforeEach(function () {
                    returnedRole = RoleHelper.getRole('foo', existingRoles);
                });

                it('should return the value of the input role', function () {
                    expect(returnedRole).toEqual('foo');
                });
            });

        });
    });
});
