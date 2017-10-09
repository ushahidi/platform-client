module.exports = SocketFactory;

SocketFactory.$inject = ['$rootScope', '$window', 'CONST', 'io'];
function SocketFactory($rootScope, $window, CONST, io) {
    var socket;
    init();
    var services = {
        on: on,
        emit: emit,
        init: init
    };

    return services;

    function init() {
        var ioRoom = CONST.PLATFORM_WEBSOCKET_REDIS_ADPATER_URL + ':' + CONST.PLATFORM_WEBSOCKET_REDIS_ADPATER_PORT;
        socket = io.connect(ioRoom);
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
