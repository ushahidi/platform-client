var ROOT_PATH = '../../../../';

describe('Message controller', function () {
    var $scope,
        $controller,
        MessageEndpoint;

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.controller('postMessagesController', require(ROOT_PATH + 'app/post/controllers/post-messages-controller.js'));

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(inject(function (_$rootScope_,
                                _$controller_,
                                _MessageEndpoint_
                               ) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        MessageEndpoint = _MessageEndpoint_;
    }));

    beforeEach(function () {
        $controller('postMessagesController', {
            $scope: $scope,
            post: {contact: {id: 1}}
        });
    });

    it('should set messages', function () {
        expect($scope.messages).toContain({
            message: 'test message',
            direction: 'incoming',
            id: 9,
            parent_id: null
        });
    });

    it('should set contact', function () {
        expect($scope.contact).toEqual({ contact: 'test@ushahidi.com', id: 1 });
    });

    it('should send a message', function () {
        spyOn(MessageEndpoint, 'save').and.callThrough();

        $scope.reply_text = 'reply message';
        $scope.form = {
            $setPristine: function () {}
        };

        $scope.sendMessage();

        expect(MessageEndpoint.save).toHaveBeenCalled();
    });
});
