Ushahidi Platform Prototype
===========================

[![Build Status](https://img.shields.io/travis/ushahidi/platform-client.svg?style=flat)](https://travis-ci.org/ushahidi/platform-client)
[![Coverage Status](https://img.shields.io/coveralls/ushahidi/platform-client.svg)](https://coveralls.io/r/ushahidi/platform-client)
[![Dependency Status](https://david-dm.org/ushahidi/platform-client/dev-status.svg?style=flat)](https://david-dm.org/ushahidi/platform-client#info=devDependencies)
[![Codacy Badge](https://www.codacy.com/project/badge/2abbf2283f7d4d98a4c61762e713d161)](https://www.codacy.com/public/ushahidi/platformclient)

___

## Try it out on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

You need to deploy the [Platform API](http://github.com/ushahidi/platform) first

## Getting set up for development

### Libraries/Packages/Dependencies

First you'll need nodejs/io.js installed,
npm takes care of the rest of our dependencies.

* nodejs v0.10 or v0.12
* io.js v1.2

### Install Build Requirements
`npm install -g gulp`

### Install Packages
`npm install`

*This will install both NPM and Bower dependencies! No separate `bower install` command is required.*

### Download and Activate Live Reload Plugin

http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions

### Navigate to project root and run Gulp

`gulp`

* watches for changes
* compiles sass
* compiles js
* rebuilds/reloads any optional servers that are enabled
* live reloads `index.html`

### Native Server

If you are running the client with a native web server like Apache or nginx, you will need to use URL rewriting to point all non-existant files to `index.html`. There is a sample `.htaccess` file, which can be used with Apache:

```
% cp server/rewrite.htaccess server/www/.htaccess
```

Nginx users will have to manually configure rewriting in the site configuration file.

#### Optional parameters ####

* `--node-server` - start a self-hosted server, instead of using a native web server like Apache or nginx. This simple server will be running at: <http://localhost:8080>.
* `--mock-backend` - use a mock backend server instead of a real instance of [ushahidi-platform](https://github.com/ushahidi/platform), delivering the JSON files in the `mocked_backend/` when API calls are made. This server will be running at: <http://localhost:8081>. See details below.
* `--docker-server` - build and run the client inside of a [Docker](https://docker.com/) container. See details below.

#### Set default options with .gulpconfig.json

Instead of having to type the flags every time, you can also use a `.gulpconfig.json` file to set the default options for running the client.

```
{
    "nodeServer": true,
    "dockerServer": false,
    "backendUrl": "http://ushahidi-backend",
    "uglifyJs": true
}
```

* `nodeServer` - always run the `node-server` task
* `dockerServer` - always run the `docker-server` task
* `backendUrl` - set the URL to your instance the [platform](https://github.com/ushahidi/platform)
* `uglifyJs` - uglify js during builds. Enabled by default

### Optional: Mock Backend

`mock-backend` task starts a internal web server that provides a mock API that can be used for testing and client side development. When running the mock backend nothing can be persisted or deleted, but otherwise the client should be fully functional.

To run the mock backend server, run `gulp --mock-backend`.

**This can be combined with the `--node-server` flag for a completely self-hosted Ushahidi Platform demo.**

### Optional: Run Docker

*[Docker](https://www.docker.com/) is a very simple way to run applications in
completely separate server environments. Our Docker application runs a local
nginx server that serves the client as simply as possible, using the
[official Docker nginx server](https://registry.hub.docker.com/_/nginx/).*

To run the Docker container, run `gulp --docker-server`

> **Note:** If you're on Linux and have `dockerServer` enabled, you will have to add the user under which you are
> running the client to the `docker` group. This will prevent you from running `gulp` with sudo.
>
> To check if `docker` group exist, issue `getent group | grep docker`. If the output of the command
> is empty, issue `sudo groupadd docker`
>
> Issue `sudo gpasswd -a ${USER} docker` to add the current logged in user to the `docker` group. Log out and then log back in to effect the changes.

**Note:** The first build of the Docker server can take several minutes. Wait till you see `server is live @ http://<ip_address_or_localhost/` before attempting to view the site.

### Running unit specs

* for test driven development, there is the gulp task 'gulp tdd'
  * when you run it:
    * all unit specs under test/unit will be run once
    * the following files will be watched and tests will be rerun on file changes
      * all files under test/unit
      * most of the files under app will be watched
        * see the 'files' array in test/karma.conf.js for more details


### I'm a developer, should I contribute to Ushahidi 3.x?

We would love your help, but the platform is in heavy development with a rapid rate
of change. If you're keen to help build something awesome, and happy to get deep
into the core workings... then yes! Read about [getting involved](https://wiki.ushahidi.com/display/WIKI/Ushahidi+v3.x+-+Getting+Involved) page.
Most of our active development happens on the [Ushahidi Phabricator](https://phabricator.ushahidi.com/).
If you haven't used Phabricator before, read [Phab Help](https://phabricator.ushahidi.com/w/help/phabricator/) after you sign up.

If you just want to fix a few bugs, or build a prototype on Ushahidi, you're probably
better helping out on [Ushahidi 2.x](https://github.com/ushahidi/Ushahidi_Web) right now.
