var ROOT_PATH = '../../../../';

describe('Post messages directive', function () {
    var $rootScope,
        $scope,
        isolateScope,
        MessageEndpoint,
        element;

    var momentMock = function () {
        return {
            isSame: function () {
                return true;
            },
            fromNow: function () {
                return '2 hours';
            },
            format: function () {
                return 'March 21, 2015';
            }
        };
    };

    beforeEach(function () {
        require(ROOT_PATH + 'test/unit/mock/mock-modules.js');

        var testApp = angular.module('testApp', [
            'ushahidi.mock'
        ]);

        testApp.directive('postMessages', require(ROOT_PATH + 'app/post/detail/post-messages.directive.js'))
        .service('ModalService', function () {
            this.close = function () {};
        })
        .value('moment', momentMock)
        .value('$filter', function () {
            return function () {};
        });

        require(ROOT_PATH + 'test/unit/simple-test-app-config')(testApp);

        angular.mock.module('testApp');
    });

    beforeEach(angular.mock.module('client-templates'));

    beforeEach(inject(function (_$rootScope_, $compile, _MessageEndpoint_) {
        $rootScope = _$rootScope_;
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
