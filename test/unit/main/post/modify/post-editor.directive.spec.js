describe('post editor directive', function () {

    var $rootScope,
        $scope,
        isolateScope,
        Notify,
        element,
        PostsSdk;
    beforeEach(function () {
        fixture.setBase('mocked_backend/api/v3');


        var testApp = makeTestApp();

        testApp.directive('postEditor', require('app/main/posts/modify/post-editor.directive'))
        .value('$filter', function () {
            return function () {};
        })
        .value('PostEntity', {})
        .value('dayjs', function () {
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
        })
        .service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': '1'
                    };
                }
            };
        });

        angular.mock.module('testApp');
    });


    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _Notify_, _PostsSdk_) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        PostsSdk = _PostsSdk_;

        $scope.post = {
            title: '',
            description: '',
            locale: 'en',
            post_content: [],
            completed_stages: [],
            published_to: [],
            post_date: new Date(),
            enabled_languages: {}
        };

        element = '<post-editor post="post" form-id="1"></post-editor>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
    }));

    describe('Initial parameter loading', function () {
        it('should load inital values', function () {
            expect($scope.post.id).toBeUndefined();
        });

        it('should load the associated form', function () {
            isolateScope.loadData().then(() => {
                expect(isolateScope.post.form.name).toEqual('test form');
            });
        });

        it('should load the associated post-content', function () {
            isolateScope.loadData().then(() => {
                expect($scope.post.post_content.length).toEqual(2);
            });
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
            spyOn(Notify, 'sdkErrors');

            isolateScope.post.id = 'fail';
            isolateScope.savePost();

            $rootScope.$apply();
            expect(Notify.sdkErrors).toHaveBeenCalled();
        });
    });
});
