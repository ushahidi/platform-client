module.exports = SocketFactory;

SocketFactory.$inject = ['$rootScope', '$window', 'CONST', 'io', 'Features'];
function SocketFactory($rootScope, $window, CONST, io, Features) {
    var socket;
    var services = {
        on: on,
        emit: emit,
        init: init
    };

    return services;

    function init() {
        if (Features.isFeatureEnabled('redis')) {
            var ioRoom = CONST.PLATFORM_WEBSOCKET_REDIS_ADAPTER_URL;
            socket = io.connect(ioRoom);
            return true;
        }
        return false;
    }

    function on(eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                callback.apply($window.socket, args);
            });
        });
    }

    function emit(eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
                if (callback) {
                    callback.apply($window.socket, args);
                }
            });
        });
    }
}
