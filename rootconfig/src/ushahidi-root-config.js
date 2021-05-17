import { registerApplication, start } from "single-spa";
import {
    constructApplications,
    constructRoutes,
    constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import fetch from "cross-fetch";
require('ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css');

const routes = constructRoutes(microfrontendLayout);

fetch("https://annatest1000.api.ushahidi.io/api/v3/config", (response) => {
    return response.json();
}).then((config) => {
    // setting config
    let wi = window;
    wi.ushahidi = wi.ushahidi || {};
    window.ushahidi.bootstrapConfig = config;

    const applications = constructApplications({
        routes,
        loadApp({ name }) {
            return System.import(name);
        },
    });
    const layoutEngine = constructLayoutEngine({ routes, applications });

    applications.forEach(registerApplication);
    layoutEngine.activate();
    start();
});
