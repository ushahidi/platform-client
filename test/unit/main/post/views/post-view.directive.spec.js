describe('post view directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postView', require('app/main/posts/views/post-view.directive'))
        .service('ViewHelper', require('app/common/services/view-helper.js'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {});

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
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
        angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
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
