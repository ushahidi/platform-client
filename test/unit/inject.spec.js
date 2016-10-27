describe('injecting things', function () {

    var $rootScope;
    var $controller;
    var $scope;

    beforeEach((done) => {

        var testApp = makeTestApp();

        testApp
        //.config(require('app/common/configs/locale-config.js'))
        .controller('postViewsController', require('app/main/posts/views/post-views.controller.js'));

        angular.mock.module('testApp');

        inject((_$rootScope_, _$controller_) => {
            $rootScope = _$rootScope_;
            $rootScope.var = 'somevar';
            $controller = _$controller_;

            $scope = $rootScope.$new();

            $controller('postViewsController', {
                $scope: $scope,
                $routeParams: {
                    view: 'list'
                }
            });

            done();
        });
    });

    it('should inject the rootscope', () => {
        expect($rootScope.var).toBe('somevar');
        expect(typeof $controller).toBe('function');
        expect($scope.currentView).toBe('list');
    });

});
