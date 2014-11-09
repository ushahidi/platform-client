describe('PostsController', function(){

    var $rootScope, $scope, $controller, mockPostEndpoint, mockPostResponse;

    beforeEach(function(){
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .config(require('../../../app/locale-config.js'))
        .controller('postsController', require('../../../app/controllers/post-list-view'));

        require('../simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = _$rootScope_.$new();
    }));

    beforeEach(function(){
        mockPostEndpoint = {
            query: function() {
                return {$promise: {
                    then: function(){}
                }};
            }
        };

        $controller('postsController', {
            $scope: $scope,
            PostEndpoint: mockPostEndpoint
        });

        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should have the right title', function(){
		expect($scope.title).toBe('Posts');
    });

    describe('PostEndpoint usage', function(){

        beforeEach(inject(function($q){

            mockPostResponse = [{
                'id': '1',
                'type': 'report',
                'title': 'Test post'
            }];

            var queryDeferred;
            mockPostEndpoint = {
                query: function() {
                    queryDeferred = $q.defer();
                    return {$promise: queryDeferred.promise};
                }
            };
            spyOn(mockPostEndpoint, 'query').and.callThrough();

            $controller('postsController', {
                $scope: $scope,
                PostEndpoint: mockPostEndpoint
            });

            queryDeferred.resolve(mockPostResponse);
            $rootScope.$digest();
            $rootScope.$apply();
        }));

        it('should query the PostEndpoint', function(){
            expect(mockPostEndpoint.query).toHaveBeenCalled();
        });

        it('should set the response from PostEndpoint.query() to $scope.posts', function(){
            expect($scope.posts).toEqual(mockPostResponse);
        });

    });

});
