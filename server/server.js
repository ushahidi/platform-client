var connect = require('connect'),
    serveStatic = require('serve-static'),
    url = require('url'),
    path = require('path');

var app = connect();
app.use(function (req, res, next) {
        var pathname = url.parse(req.url).pathname;
        if (!path.extname(pathname)) {
            req.url = '/';
        }
        next();
    });
app.use(serveStatic('server/www'));

module.exports = function () {
    var server = app.listen(process.env.PORT || 8080, function () {
        console.log('Server listening on port ' + server.address().port);
    });

    return server;
};
