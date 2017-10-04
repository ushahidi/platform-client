module.exports = SocketFactory;

SocketFactory.$inject = ['$rootScope', '$window', 'io'];
function SocketFactory($rootScope, $window, io) {
    var socket;
    init();
    var services = {
        on: on,
        emit: emit,
        init: init
    };

    return services;

    function init() {
        var ioRoom = 'http://127.0.0.1:3009/';
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
