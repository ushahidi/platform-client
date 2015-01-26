var ROOT_PATH = '../../../../';

describe('posts list controller', function(){

    var $rootScope,
        $scope,
        $controller,
        mockPostEndpoint,
        mockPostResponse;

    beforeEach(function(){
        var testApp = angular.module('testApp', [
        'pascalprecht.translate'
        ])
        .config(require(ROOT_PATH + 'app/common/configs/locale-config.js'))
        .controller('postListViewController', require(ROOT_PATH + 'app/post/controllers/post-list-view-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

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

        $controller('postListViewController', {
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

            mockPostResponse = {
                results:
                [{
                    'id': '1',
                    'type': 'report',
                    'title': 'Test post'
                }]
            };

            var queryDeferred;
            mockPostEndpoint = {
                query: function() {
                    queryDeferred = $q.defer();
                    return {$promise: queryDeferred.promise};
                }
            };
            spyOn(mockPostEndpoint, 'query').and.callThrough();

            $controller('postListViewController', {
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
            expect($scope.posts).toEqual(mockPostResponse.results);
        });

    });

});
