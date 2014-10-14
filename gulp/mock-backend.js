var connect = require('gulp-connect'),
    url = require('url'),
    path = require('path'),
    cors = require('cors');

module.exports = function(root) {
    return function(){
        connect.server({
            root: root,
            port: '8081',
            middleware: function (/*connect, opt*/) {
                return [

                    cors(),

                    function (req, res, next) {
                        var pathname = url.parse(req.url).pathname;
                        pathname = pathname + '.json';
                        req.url = pathname;
                        if (!path.extname(pathname)) {
                            req.url = '/';
                        }
                        next();
                    }

                ];
            }
        });
    };
};
