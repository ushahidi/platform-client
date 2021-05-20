import { registerApplication, start } from "single-spa";
import {
    constructApplications,
    constructRoutes,
    constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
require('ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css');
const routes = constructRoutes(microfrontendLayout);

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
