describe('post relation directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        GlobalFilter,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postRelation', require('app/data/common/post-edit-create/post-relation.directive'))
        .value('$filter', function () {
            return function () {};
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _GlobalFilter_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();

        GlobalFilter = _GlobalFilter_;
        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');

        $scope.attribute = {
            config: {
                input: {
                    form: [1,2,3]
                }
            }
        };

        element = '<post-relation id="id" name="name" model="model" required="required" attribute="attribute"></post-relation>';
        element = $compile(element)($scope);
        $scope.$digest();
        isolateScope = element.children().scope();
    }));

    describe('test directive functions', function () {
        it('should select a given post', function () {
            isolateScope.selectPost({
                id: 1
            });

            expect(isolateScope.model).toEqual(1);
        });

        it('should clear the selected post', function () {
            isolateScope.clearPost();

            expect(isolateScope.model).toEqual(null);
        });

        it('should query based on a given event', function () {
            isolateScope.searchTerm = 'test';

            var mockEvent = {
                preventDefault: function () {}
            };
            isolateScope.search(mockEvent);
            expect(isolateScope.results[0].id).toEqual(1);
        });
    });
});
