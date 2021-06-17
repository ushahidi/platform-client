describe('intercom controller', function () {

    var $rootScope,
        $controller,
        $scope;

    var mockWindow = {
        Intercom: function () {},
        ushahidi: {
            intercomAppId: 'test',
            apiUrl: 'test'
        },
        self: 'top',
        top: 'top'
    };

    beforeEach(function () {
        makeTestApp()
        .value('$window', mockWindow)
        .controller('intercomController', require('app/common/controllers/intercom.js'));

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;

        $scope = _$rootScope_.$new();
    }));

    beforeEach(function () {
        $controller('intercomController', {
            $rootScope: $rootScope,
            $scope: $scope
        });
    });

    it('should start the intercom interface on login', function () {
        spyOn($scope, 'startIntercom').and.callThrough();
        $rootScope.$broadcast('event:authentication:login:succeeded');
        expect($scope.startIntercom).toHaveBeenCalled();
    });

    it('should stop the intercom interface on logout', function () {
        spyOn($scope, 'stopIntercom').and.callThrough();
        $rootScope.$broadcast('event:authentication:logout:succeeded');
        expect($scope.stopIntercom).toHaveBeenCalled();
    });
});
