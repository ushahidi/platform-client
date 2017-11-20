describe('Post detail directive', function () {
    var $scope,
       $rootScope,
       isolateScope,
       PostEndpoint,
       Notify,
       FormEndpoint,
       $compile,
       element;

    function moment() {
        return {
            isSame: function () {},
            fromNow: function () {},
            format: function () {}
        };
    }

    beforeEach(function () {
        let testApp = makeTestApp();

        testApp.directive('postDetailData', require('app/main/posts/detail/post-detail-data.directive.js'))
         .service('$state', function () {
            return {
                'go': function () {
                    return {
                        'id': 1
                    };
                }
            };
        });

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_,
                                _Notify_,
                                _PostEndpoint_,
                                _FormEndpoint_,
                                _$compile_
                               ) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        PostEndpoint = _PostEndpoint_;
        FormEndpoint = _FormEndpoint_;
        $compile = _$compile_;

        $rootScope.setLayout = function () {};

        $scope.post = {
            tags: [],
            form: {
                id: 1,
                name: 'test form'
            },
            user: {
                id: 1
            },
            status: 'draft',
            completed_stages: ['1', '2', '3']
        };

        $scope.moment = moment;
        element = '<post-detail-data post="post"></post-detail-data>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
        // $rootScope.$apply();


    }));

    it('should activate a stage', function () {
        var selectedStage = {id: '1', active: false};
        isolateScope.activateTaskTab(selectedStage);
        expect(isolateScope.visibleTask.id).toEqual(selectedStage.id);
    });

    it('should set visible stage to 3', function () {
        isolateScope.activateTaskTab({id: 3});
        expect(isolateScope.visibleTask.id).toEqual(3);
    });

    it('should show the current published state as draft', function () {
        expect(isolateScope.publishedFor()).toEqual('post.publish_for_you');
    });

    it('should show type as false for point and geometry but true for other', function () {
        expect(isolateScope.showType('point')).toEqual(false);
        expect(isolateScope.showType('geometry')).toEqual(false);
        expect(isolateScope.showType('other')).toEqual(true);
    });

    it('should publish a post to a given role', function () {
        spyOn(Notify, 'notify');

        isolateScope.post.id = 'pass';
        isolateScope.publishPostTo(isolateScope.post);
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to publish a post to a given role', function () {
        spyOn(Notify, 'apiErrors');

        isolateScope.post.id = 'fail';
        isolateScope.publishPostTo(isolateScope.post);
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

    it('should fail to publish a post to a given role when a required stage is not completed', function () {
        spyOn(Notify, 'errorsPretranslated');

        isolateScope.post.id = 'pass';
        isolateScope.tasks = [{
            required: true
        }];
        isolateScope.post.completed_stages = [];

        isolateScope.publishPostTo(isolateScope.post);
        expect(Notify.errorsPretranslated).toHaveBeenCalled();
    });

    /* @todo test in post actions
    it('should delete a post', function () {
        spyOn(Notify, 'notify');

        $scope.post.id = 'pass';
        $scope.deletePost();

        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to delete a post', function () {
        spyOn(Notify, 'apiErrors');

        $scope.post.id = 'fail';
        $scope.deletePost();

        expect(Notify.apiErrors).toHaveBeenCalled();
    });
     */


});
