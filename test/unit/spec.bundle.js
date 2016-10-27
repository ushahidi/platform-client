/*
 * When testing with Webpack and ES6, we have to do some
 * preliminary setup. Because we are writing our tests also in ES6,
 * we must transpile those as well, which is handled inside
 * `karma.conf.js` via the `karma-webpack` plugin. This is the entry
 * file for the Webpack tests. Similarly to how Webpack creates a
 * `bundle.js` file for the compressed app source files, when we
 * run our tests, Webpack, likewise, compiles and bundles those tests here.
*/

require('babel-polyfill');

require('angular');

// Built by the core Angular team for mocking dependencies
require('angular-mocks');

global._ = require('underscore');

// Load mocks services
require('test/unit/mock/mock-modules.js');

// Create testApp
global.makeTestApp = require('test/unit/make-test-app');

// We use the context method on `require` which Webpack created
// in order to signify which files we actually want to require or import.
// Below, `context` will be a/an function/object with file names as keys.
// Using that regex, we scan within `test/unit` and target
// all files ending with `.spec.js` or `-spec.js` and trace its path.
// By passing in true, we permit this process to occur recursively.

var context = require.context('test/unit/', true, /spec\.js$/);

// Get all files, for each file, call the context function
// that will require the file and load it here. Context will
// loop and require those spec files here.
context.keys().forEach(context);
