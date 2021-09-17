require('./app.js');
import singleSpaAngularJS from 'single-spa-angularjs';

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

export const mount = ngLifecycles.mount;
export const unmount = ngLifecycles.unmount;

