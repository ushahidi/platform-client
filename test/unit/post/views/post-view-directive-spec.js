var ROOT_PATH = '../../../../';

describe('post view directive', function () {

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

        testApp.directive('postView', require(ROOT_PATH + 'app/post/views/post-view.directive'))
        .service('ViewHelper', require(ROOT_PATH + 'app/common/services/view-helper.js'))
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
        $scope.currentView = 'list';
        element = '<post-view current-view="currentView"></post-view>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.currentView).toEqual('list');
    });


    it('should set current view to map when unset', function () {
        inject(function (_$rootScope_, $compile, _Notify_) {
            $rootScope = _$rootScope_;
            $scope = _$rootScope_.$new();

            Notify = _Notify_;

            $scope.post = fixture.load('posts/120.json');
            $scope.currentView = undefined;
            element = '<post-view current-view="currentView"></post-view>';
            element = $compile(element)($scope);
            $rootScope.$digest();
            isolateScope = element.isolateScope();
        });

        expect(isolateScope.currentView).toEqual('map');
    });
});
