var ROOT_PATH = '../../../../';

describe('post value edit directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postValueEdit', require(ROOT_PATH + 'app/post/modify/post-value-edit.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');
        $scope.post.values = {
            'test': [null]
        };
        $scope.form = {};
        $scope.attribute = {
            key: 'test',
            cardinality: 0
        };

        element = '<post-value-edit form="form" post="post" attribute="attribute"></post-value-edit>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('test directive functions', function () {
        it('should return the correct value for each attr input', function () {
            expect(isolateScope.isDate({input: 'date'})).toBe(true);
            expect(isolateScope.isDateTime({input: 'datetime'})).toBe(true);
            expect(isolateScope.isText({input: 'text'})).toBe(true);
            expect(isolateScope.isTextarea({input: 'textarea'})).toBe(true);
            expect(isolateScope.isCheckbox({input: 'checkbox'})).toBe(true);
        });

        it('should allow adding and removing of values', function () {
            expect(isolateScope.canAddValue({cardinality: 0})).toBe(true);

            $scope.post.values.test = [1,2];
            expect(isolateScope.canAddValue({cardinality: 1, key: 'test'})).toBe(false);

            expect(isolateScope.canRemoveValue({key: 'test'})).toBe(true);

            isolateScope.addValue({key: 'test'});
            expect($scope.post.values.test.length).toEqual(3);

            isolateScope.removeValue({key: 'test'});
            expect($scope.post.values.test.length).toEqual(2);
        });
    });
});
