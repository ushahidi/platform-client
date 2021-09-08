describe('post value edit directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element,
        SurveysSdk;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postValueEdit', require('app/data/common/post-edit-create/post-value-edit.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _SurveysSdk_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        Notify = _Notify_;
        SurveysSdk = _SurveysSdk_;

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

    });
});
