require('./app.js');
import singleSpaAngularJS from 'single-spa-angularjs';
import fetch from 'cross-fetch';

//exporting lifecycle-functions for angular-app
const ngLifecycles = singleSpaAngularJS({
    angular: angular,
    mainAngularModule: 'app',
    uiRouter: true,
    preserveGlobal: false,
    strictDi: true,
    template: require('./index.html')
    });

export const bootstrap = ngLifecycles.bootstrap;

export const mount = (opts, mountedInstances, props) => {
    if (window.ushahidi && window.ushahidi.backendUrl && !window.ushahidi.bootstrapConfig) {
       return fetch(window.ushahidi.backendUrl, response => {
        return response.json();
    }).then(config => {
        // setting config
        window.ushahidi.bootstrapConfig = config;
        return ngLifecycles.mount(opts, mountedInstances, props);
    });
    } else {
        return ngLifecycles.mount(opts, mountedInstances, props);
    }
}
export const unmount = ngLifecycles.unmount;
