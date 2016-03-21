var ROOT_PATH = '../../../../';

describe('intercom controller', function () {

    var $rootScope,
        $controller,
        $scope;

    var mockWindow = {
        Intercom: function () {},
        ushahidi: {
            intercomAppId: 'test',
            apiUrl: 'test'
        }
    };

    beforeEach(function () {
        var testApp = angular.module('testApp', [
        'ushahidi.mock',
        'pascalprecht.translate'
        ])
        .value('$window', mockWindow)
        .controller('intercomController', require(ROOT_PATH + 'app/common/controllers/intercom.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_, _$controller_) {
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
