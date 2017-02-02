describe('Post detail controller', function () {
    var $scope,
       $rootScope,
       $controller,
       PostEndpoint,
       Notify,
       FormEndpoint;

    function moment() {
        return {
            isSame: function () {},
            fromNow: function () {},
            format: function () {}
        };
    }

    beforeEach(function () {

        makeTestApp()
       .controller('postDetailController', require('app/main/posts/detail/post-detail.controller.js'))
       ;

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.inject(function (_$rootScope_,
                                _$controller_,
                                _Notify_,
                                _PostEndpoint_,
                                _FormEndpoint_
                               ) {
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        Notify = _Notify_;
        $controller = _$controller_;
        PostEndpoint = _PostEndpoint_;
        FormEndpoint = _FormEndpoint_;
    }));

    beforeEach(function () {
        $controller('postDetailController', {
            $scope: $scope,
            post: {
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
            },
            moment: moment,
            $rootScope: {
                setLayout: function () {}
            }
        });
        $rootScope.$digest();
        $rootScope.$apply();
    });

    it('should activate a stage', function () {
        var selectedStage = {id: '1', active: false};
        $scope.activateTaskTab(selectedStage);
        expect($scope.visibleTask.id).toEqual(selectedStage.id);
    });

    it('should set visible stage to 3', function () {
        $scope.activateTaskTab({id: 3});
        expect($scope.visibleTask.id).toEqual(3);
    });

    it('should show the current published state as draft', function () {
        expect($scope.publishedFor()).toEqual('post.publish_for_you');
    });

    it('should show type as false for point and geometry but true for other', function () {
        expect($scope.showType('point')).toEqual(false);
        expect($scope.showType('geometry')).toEqual(false);
        expect($scope.showType('other')).toEqual(true);
    });

    it('should publish a post to a given role', function () {
        spyOn(Notify, 'notify');

        $scope.post.id = 'pass';
        $scope.publishPostTo($scope.post);
        expect(Notify.notify).toHaveBeenCalled();
    });

    it('should fail to publish a post to a given role', function () {
        spyOn(Notify, 'apiErrors');

        $scope.post.id = 'fail';
        $scope.publishPostTo($scope.post);
        expect(Notify.apiErrors).toHaveBeenCalled();
    });

    it('should fail to publish a post to a given role when a required stage is not completed', function () {
        spyOn(Notify, 'errorsPretranslated');

        $scope.post.id = 'pass';
        $scope.tasks = [{
            required: true
        }];
        $scope.post.completed_stages = [];

        $scope.publishPostTo($scope.post);
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
