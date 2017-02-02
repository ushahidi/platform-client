describe('post editor directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element;

    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postEditor', require('app/main/posts/modify/post-editor.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})
        .value('moment', function () {
            return {
                subtract : function () {
                    return this;
                },
                fromNow : function () {
                    return '';
                },
                isSame : function () {
                    return true;
                }
            };
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;

        $scope.post = fixture.load('posts/120.json');

        $scope.form = {
            id: 1,
            name: 'test form',
            type: 'Report',
            description: 'Testing form',
            created: '1970-01-01T00:00:00+00:00'
        };

        element = '<post-editor post="post" form="form"></post-editor>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('Initial parameter loading', function () {
        it('should load provided post', function () {
            expect($scope.post.id).toEqual(120);
        });

        it('should load the associated form', function () {
            expect($scope.post.form.name).toEqual('test form');
        });

        it('should load the associated form stages', function () {
            expect(isolateScope.tasks.length).toEqual(2);
        });
    });
    describe('test directive functions', function () {
        it('should save a post', function () {
            spyOn(Notify, 'notify');

            isolateScope.post.id = 'pass';
            isolateScope.savePost();

            $rootScope.$apply();

            expect(Notify.notify).toHaveBeenCalled();
        });

        it('should fail to save a post', function () {
            spyOn(Notify, 'errors');

            isolateScope.post.id = 'fail';
            isolateScope.savePost();

            $rootScope.$apply();
            expect(Notify.errors).toHaveBeenCalled();
        });
    });
});
