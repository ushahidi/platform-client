var ROOT_PATH = '../../../../';

describe('post choose form directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        GlobalFilter,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock',
            'pascalprecht.translate'
        ]);

        testApp.directive('postChooseForm', require(ROOT_PATH + 'app/post/directives/post-choose-form-directive'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        $rootScope.hasPermission = function () {};

        GlobalFilter = _GlobalFilter_;
        Notify = _Notify_;

        $scope.post = {};
        element = '<post-choose-form post="post" active-form="activeForm"></post-choose-form>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();

    }));

    describe('test directive functions', function () {
        it('should load the forms', function () {
            expect(isolateScope.availableForms.length).toEqual(1);
        });

        it('should check if filters are not disabled', function () {
            expect(isolateScope.filterNotDisabled({disabled: true})).toBe(false);
        });

        it('should set the form', function () {
            isolateScope.chooseForm({id: 1});

            expect($scope.post.form.id).toEqual(1);
        });
    });
});
