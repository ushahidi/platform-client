Ushahidi Platform Web Client
============================

[![Build Status](https://travis-ci.org/ushahidi/platform-client.svg?branch=master)](https://travis-ci.org/ushahidi/platform-client)
[![Coverage Status](https://coveralls.io/repos/github/ushahidi/platform-client/badge.svg?branch=master)](https://coveralls.io/github/ushahidi/platform-client?branch=master)
[![Dependency Status](https://david-dm.org/ushahidi/platform-client/dev-status.svg?style=flat)](https://david-dm.org/ushahidi/platform-client#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/2abbf2283f7d4d98a4c61762e713d161)](https://www.codacy.com/public/ushahidi/platformclient)

___

## Try it out on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

You need to deploy the [Platform API](http://github.com/ushahidi/platform) first

## Getting set up for development

### Libraries/Packages/Dependencies

First you'll need nodejs or io.js installed,
npm takes care of the rest of our dependencies.

* nodejs v6

### Install, build and run a local dev server

1. Clone the repo
    ```git clone https://github.com/ushahidi/platform-client.git```
2. Navigate to project root
    ```cd platform-client```
3. Install Build Requirements
    ```
    npm install -g gulp
    ```
4. Install Packages
    ```
    npm install
    ```

    *This will install both NPM and Bower dependencies! No separate `bower install` command is required.*
6. Set up build options. Create a `.env` file, you'll need to point `BACKEND_URL` at an instance of the [platform api](https://github.com/ushahidi/platform)
    ```
    NODE_SERVER=true
    BACKEND_URL=http://ushahidi-backend
    ```

7. Run gulp

    ```
    gulp
    ```
8. You should now have a local development server running on http://localhost:8080

## Extra config and options

### Download and Activate Live Reload Plugin

http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions

### Gulp

Our gulp build
* watches for changes
* compiles sass
* compiles js
* rebuilds/reloads any optional servers that are enabled
* live reloads `index.html`

#### Optional parameters ####

* `--node-server` - start a self-hosted server, instead of using a native web server like Apache or nginx. This simple server will be running at: <http://localhost:8080>.
* `--mock-backend` - build the app with an mock backend service, delivering the JSON files in the `mocked_backend/` when API calls are made. See details below.

#### Set default options with .env

Instead of having to type the flags every time, you can also use a `.gulpconfig.json` file to set the default options for running the client.

```
NODE_SERVER=true
BACKEND_URL=http://ushahidi-backend
UGLIFY_JS=true
MOCK_BACKEND=false
KARMA_CHROME=false
PORT=8080
```

* `NODE_SERVER` - always run the `node-server` task
* `BACKEND_URL` - set the URL to your instance the [platform](https://github.com/ushahidi/platform)
* `UGLIFY_JS` - uglify js during builds. Enabled by default
* `MOCK_BACKEND` - build the app with an mock backend.
* `KARMA_CHROME` - Use chrome to run karma tests
* `PORT` - set the port to run `node-server`

#### Optional: Mock Backend

You can run `gulp build` with a `--mock-backend` option. This builds the app with an [http mock](https://docs.angularjs.org/api/ngMock/service/$httpBackend) service that provides a mock API that can be used for testing and client side development. When running the mock backend nothing can be persisted or deleted, but otherwise the client should be fully functional.

To build with the mock backend service, run `gulp build --mock-backend`.

**This can be combined with the `--node-server` flag for a completely self-hosted Ushahidi Platform demo.**

#### Running unit specs

To run unit tests run:
```
gulp test
```

To run end-to-end integration tests run:

```
gulp build --mock-backend
gulp node-server # <- might need to run this in another window
npm run protractor
```

For test driven development we have a gulp task `gulp tdd`. This watches for JS changes and re-runs the unit tests.

### Native Server (Apache or Nginx)

If you are running the client with a native web server like Apache or nginx, you will need to use URL rewriting to point all non-existant files to `index.html`. There is a sample `.htaccess` file, which can be used with Apache:

```
% cp server/rewrite.htaccess server/www/.htaccess
```

Nginx users will have to manually configure rewriting in the site configuration file.

### I'm a developer, should I contribute to Ushahidi 3.x?

Yes! Development moves pretty quickly but the tech stack is getting more and more stable. If you're keen to help build something awesome, [jump on board](https://www.ushahidi.com/support/get-involved)..

