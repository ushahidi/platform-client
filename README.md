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

### Download and Activate Live Reload Plugin

http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions

### Navigate to project root and run Gulp

`gulp`

* watches for changes
* compiles sass
* compiles js
* rebuilds docker container (when `vm` is enabled)
* live reloads `index.html`

### I'm a developer, should I contribute to Ushahidi 3.x?

We would love your help, but the platform is in heavy development with a rapid rate
of change. If you're keen to help build something awesome, and happy to get deep
into the core workings... then yes! Read about [getting involved](https://wiki.ushahidi.com/display/WIKI/Ushahidi+v3.x+-+Getting+Involved) page.
Most of our active development happens on the [Ushahidi Phabricator](https://phabricator.ushahidi.com/).
If you haven't used Phabricator before, read [Phab Help](https://phabricator.ushahidi.com/w/help/phabricator/) after you sign up.

If you just want to fix a few bugs, or build a prototype on Ushahidi, you're probably
better helping out on [Ushahidi 2.x](https://github.com/ushahidi/Ushahidi_Web) right now.
