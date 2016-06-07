var angularserver = require('angularjs-server');
var express = require('express');
var fs = require('fs');

// The main index.html file for your application, that you'd normally serve to browsers to start the app.
// This should have any script tags for your application removed from it, as they will be added separately.
var templateFile = __dirname + '/www/index.html';
var template = fs.readFileSync(templateFile);

// Directory to serve static resources from.
var staticDir = __dirname + '/www/';

var app = express();
var angularMiddlewares = angularserver.Server({
    template: template,

    // Scripts that should be loaded into the angularjs context on the server.
    // This should include AngularJS itself and all of the source files required
    // to register your Angular modules, but *not* code to bootstrap the
    // application.
    serverScripts: [
        __dirname + '/server-bundle.js'
    ],

    // Scripts that should be loaded by the client browser to render the page.
    // This should include the same set of files to load Angular itself and
    // your Angular modules, but should also include additional code that
    // calls into angular.bootstrap to kick off the application.
    // Unlike serverScripts, these are URLs.
    clientScripts: [
        '/js/bundle.js'
    ],

    // Angular modules that should be used when running AngularJS code on
    // the server. 'ng' is included here by default, along with the
    // special AngularJS-Server overrides of 'ng'.
    angularModules: [
        'app'
    ]
});

// Make the scripts and other assets available to the browser.
app.use('/', express.static(staticDir));

// Serve all other URLs by rendering the Angular page on the server.
app.use(angularMiddlewares.htmlGenerator);

app.listen(3000);
console.log('Listening on port 3000');
