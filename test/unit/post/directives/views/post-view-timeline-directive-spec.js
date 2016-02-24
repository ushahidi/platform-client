var ROOT_PATH = '../../../../../';

describe('post view timeline directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;
    var mockEvent = {
        preventDefault: function () {}
    };

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');

        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postViewTimeline', require(ROOT_PATH + 'app/post/directives/views/post-view-timeline-directive'))
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

        element = '<post-view-timeline></post-view-timeline>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    it('should load initial values', function () {
        expect(isolateScope.isLoading).toBe(false);
    });
});
