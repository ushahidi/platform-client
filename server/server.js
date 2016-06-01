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
app.use(serveStatic('server/www', {
    maxAge: '1h',
    setHeaders: setCustomCacheControl
}));

function setCustomCacheControl(res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html' ||
        serveStatic.mime.lookup(path) === 'application/javascript' ||
        serveStatic.mime.lookup(path) === 'application/json') {
        // Custom Cache-Control for HTML or JS files
        res.setHeader('Cache-Control', 'public, max-age=0');
    }
}

module.exports = function () {
    var server = app.listen(process.env.PORT || 8080, function () {
        console.log('Server listening on port ' + server.address().port);
    });

    return server;
};
