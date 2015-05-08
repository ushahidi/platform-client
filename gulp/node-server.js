var connect = require('gulp-connect'),
    url = require('url'),
    path = require('path');

module.exports = function (root) {
    return function () {
        connect.server({
            root: root,
            middleware: function (/*connect, opt*/) {
                return [
                    function (req, res, next) {
                        var pathname = url.parse(req.url).pathname;
                        if (!path.extname(pathname)) {
                            req.url = '/';
                        }
                        next();
                    }
                ];
            },
            port: process.env.PORT || 8080
        });
    };
};
