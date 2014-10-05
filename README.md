Ushahidi Platform Prototype
===========================

### Libraries/Packages/Dependencies

* Nodejs
* Bower
* Napa
* Browserify
* Gulp (and various gulp plugins)
* Libsass/node-sass (via gulp-sass)
* Bourbon 3.1
* Neat 1.5
* Refills 0.2

### Install Build Requirements
`npm install -g gulp napa browserify`

### Install Packages
`npm install`

*This will install both NPM and Bower dependencies! No separate `bower install` command is required.*

### Optional: Run Docker

*[Docker](https://www.docker.com/) is a very simple way to run applications in
completely separate server environments. Our Docker application runs a local
nginx server that serves the client as simply as possible, using the
[official Docker nginx server](https://registry.hub.docker.com/_/nginx/).*

To enable the Docker container, edit `gulpfile.js` and set `options.vm = true`.

**Note:** If you're on Linux and have `vm` enabled, you will have to add the user under which you are
running the client to the `docker` group. This will prevent you from running `gulp` with sudo.

To check if `docker` group exist, issue `getent group | grep docker`. If the output of the command
is empty, issue `sudo groupadd docker`

Issue `sudo gpasswd -a ${USER} docker` to add the current logged in user to the `docker` group. Log out and then log back in to effect the changes.

### Optional: Run nodeserver

`nodserver` task starts an internal web server to serve the client without having to setup a web server.

To enable nodeserver, edit `gulpfile.js` and set `options.nodeserver = true`.

### Download and Activate Live Reload Plugin

http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions

### Navigate to project root and run Gulp

`gulp`

* watches for changes
* compiles sass
* compiles js
* rebuilds docker container (when `vm` is enabled)
* starts internal web server and access it at http://localhost:8080 ( when `nodeserver` is enabled)
* live reloads `index.html`

**Note:** If you enable `vm` and run `gulp` for the first time, it take a while for it to build and start docker. Wait till you see `server is live @ http://<ip_address_or_localhost/`

#### Optional parameters ####
You cann pass in the '--mock-backend' parameter to the gulp command.
Two things will happen then:
* 1. a simple nodeserver will be started
  * which delivers all json files within the 'mocked_backend' folder to localhost:8081
  * the json extension will be truncated
    * so 'mocked_backend/test.json' maps to 'localhost:8081/test'
* 2. the backendUrl env variable, which is used in app.js for configuring the api backend, will be reset to the url of the just started node mock server

### I'm a developer, should I contribute to Ushahidi 3.x?

We would love your help, but the platform is in heavy development with a rapid rate
of change. If you're keen to help build something awesome, and happy to get deep
into the core workings... then yes! Read about [getting involved](https://wiki.ushahidi.com/display/WIKI/Ushahidi+v3.x+-+Getting+Involved) page.
Most of our active development happens on the [Ushahidi Phabricator](https://phabricator.ushahidi.com/).
If you haven't used Phabricator before, read [Phab Help](https://phabricator.ushahidi.com/w/help/phabricator/) after you sign up.

If you just want to fix a few bugs, or build a prototype on Ushahidi, you're probably
better helping out on [Ushahidi 2.x](https://github.com/ushahidi/Ushahidi_Web) right now.
