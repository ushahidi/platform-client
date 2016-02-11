var ROOT_PATH = '../../../../';

describe('post editor directive', function () {

    var $rootScope,
        $scope,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postEditor', require(ROOT_PATH + 'app/post/directives/post-editor-directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})

        .service('RoleHelper', require(ROOT_PATH + 'app/common/services/role-helper.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        $scope.post = fixture.load('posts/120.json');

        $scope.activeForm = {
            id: 1,
            name: 'Test form',
            type: 'Report',
            description: 'Testing form',
            created: '1970-01-01T00:00:00+00:00'
        };

        element = '<post-editor post="post" active-form="activeForm"></post-editor>';
        element = $compile(element)($scope);
        $scope.$digest();
    }));

    it('should do something', function () {
        console.log($scope.post);
    });
});
