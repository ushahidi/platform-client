var connect = require('gulp-connect'),
    url = require('url'),
    path = require('path'),
    cors = require('cors'),
    _s = require('underscore.string'),
    bodyParser = require('body-parser');


module.exports = function(root) {
    return function(){
        connect.server({
            root: root,
            port: '8081',
            middleware: function (/*connect, opt*/) {
                return [

                    // use this middleware for allowing CORS
                    cors(),

                    // use this middleware for providing access to the http body
                    bodyParser.json(),

                    // use custom middleware for login and static json delivery for resource requests
                    function (req, res, next) {
                        var pathname = url.parse(req.url).pathname;

                        // handle sign in
                        if(_s.endsWith(pathname, 'oauth/token') && req.method === 'POST')
                        {
                            // check for correct credentials
                            if(req.body.username === 'admin' && req.body.password === 'admin')
                            {
                                res.writeHead(200);
                                res.write(JSON.stringify({
                                    'access_token':'mock-backend-token',
                                    'token_type':'Bearer',
                                    'expires':1414349228,
                                    'expires_in':3600,
                                    'refresh_token':'mock-backend-refresh-token',
                                    'refresh_token_expires_in':604800
                                }));
                            }
                            else
                            {
                                res.writeHead(400);
                                res.write(JSON.stringify({
                                    'error':'invalid_request',
                                    'error_description':'The user credentials were incorrect.'
                                }));
                            }

                            return res.end();
                        }

                        // meta data (userid, username, api endpoints etc) at root path
                        else if(pathname === '/' || pathname === '')
                        {
                            // req.url = 'root_metadata.json';
                            res.writeHead(200);
                            res.write(JSON.stringify(
                                {
                                    'user': {
                                        'id': 2,
                                        'username': 'admin'
                                    }
                                }
                            ));

                            return res.end();
                        }

                        // if it's not about sign in:
                        // assume it is a resource request
                        // => deliver the corresponding static json files via 'connect'
                        else
                        {
                            pathname = pathname + '.json';
                            req.url = pathname;
                            if (!path.extname(pathname)) {
                                req.url = '/';
                            }
                        }

                        next();
                    }

                ];
            }
        });
    };
};
