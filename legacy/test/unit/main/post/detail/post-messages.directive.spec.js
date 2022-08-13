describe('Post messages directive', function () {
    var $rootScope,
        $scope,
        isolateScope,
        MessageEndpoint,
        element;


    beforeEach(function () {

        var testApp = makeTestApp();

        testApp.directive('postMessages', require('app/data/common/post-edit-detail/post-messages.directive.js'))
        .service('ModalService', function () {
            this.close = function () {};
        })
        .value('$filter', function () {
            return function () {};
        })
        .factory('dayjs', function () {
            return require('dayjs');
        })
        .factory('relativeTime', function () {
            return require('dayjs/plugin/relativeTime');
        });

        angular.mock.module('testApp');
    });



    beforeEach(angular.mock.inject(function (_$rootScope_, $compile, _MessageEndpoint_) {
        $rootScope = _$rootScope_;
        $rootScope.isAdmin = function () {
            return true;
        };
        $scope = _$rootScope_.$new();
        $scope.post = {
            contact: {
                id: 1
            }
        };

        element = '<post-messages post="post"></post-messages>';
        element = $compile(element)($scope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
        isolateScope.messages[0].displayTime = '2 hours';
        MessageEndpoint = _MessageEndpoint_;
    }));

    it('should set messages', function () {
        expect(isolateScope.messages).toContain({
            message: 'test message',
            direction: 'incoming',
            id: 9,
            parent_id: null,
            displayTime: '2 hours'
        });
    });

    it('should set contact', function () {
        expect(isolateScope.contact).toEqual({ contact: 'test@ushahidi.com', id: 1 });
    });

    it('should send a message', function () {
        isolateScope.message = {};
        spyOn(MessageEndpoint, 'save').and.callThrough();

        isolateScope.message.reply_text = 'reply message';
        isolateScope.form = {
            $setPristine: function () {}
        };

        isolateScope.sendMessage();

        expect(MessageEndpoint.save).toHaveBeenCalled();
    });
});
