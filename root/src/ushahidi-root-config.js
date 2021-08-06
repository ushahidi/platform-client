import { registerApplication, start } from "single-spa";
import {
    constructApplications,
    constructRoutes,
    constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { getPageMetadata } from "@ushahidi/utilities";

require("ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css");
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
let siteTitle = '';
function generatePageTitle (pageTitle = '') {
    return `${pageTitle} - ${siteTitle}`;
}
// Setting initial page-metadata
getPageMetadata().then(data => {
    // Setting page-metadata that does not change
    siteTitle = data.title;
    let description = document.querySelector('[name="description"]');
    description.content = data.description;
    if (data.appleId) {
        let appleStore = document.querySelector('[name="apple-itunes-app"]');
        appleStore.content = `app-id=${data.appleId}, app-argument=${document.location.href}`;
    }
});

// Watching for changes in page-title due to route-changes in legacy-app (this needs to be handled differently once we start moving UI)
    window.addEventListener('newTitle', evt =>  {
        document.title = generatePageTitle(evt.title)
    });
