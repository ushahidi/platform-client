import { registerApplication, start } from "single-spa";
import {
    constructApplications,
    constructRoutes,
    constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { getPageMetadata, setBootstrapConfig } from "@ushahidi/utilities";

require("./loading.scss");

require("ushahidi-platform-pattern-library/assets/fonts/Lato/css/fonts.css");

setBootstrapConfig();

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
    routes,
    loadApp({ name }) {
        return System.import(name);
    },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

let globalLayout = 'layout-a';
applications.forEach(registerApplication);
layoutEngine.activate();

const showError = function (show) {
    const element = document.querySelector('#bootstrap-error');
    show ? element.classList.remove('hidden') : element.classList.add('hidden') ;
}

const showLoading = function (show) {
    const element = document.querySelector('#bootstrap-loading')
    show ? element.classList.remove("hidden") : element.classList.add("hidden");
}

let siteTitle = "";

function generatePageTitle(pageTitle = "") {
    return `${pageTitle} - ${siteTitle}`;
}


// Setting initial page-metadata
getPageMetadata().then((data) => {
    start();

    // Setting page-metadata that does not change
    siteTitle = data.title;
    let description = document.querySelector('[name="description"]');
    description.content = data.description;
    if (data.appleId) {
        let appleStore = document.querySelector('[name="apple-itunes-app"]');
        appleStore.content = `app-id=${data.appleId}, app-argument=${document.location.href}`;
    }
}, err => {
    if (err.response.data.errors[0].message) {
        document.getElementById('bootstrap-error-message').innerHTML = err.response.data.errors[0].message;
    }
    // showing errorMessage
    showError(true);
    // hiding spinner
    showLoading(false);
});

window.addEventListener('single-spa:before-first-mount', () => {
    // hiding loading-spinner
    showLoading("false");
  });

// Watching for changes in page-title due to route-changes in legacy-app (this needs to be handled differently once we start moving UI)
window.addEventListener("newTitle", (evt) => {
    document.title = generatePageTitle(evt.title);
});
// Watching for changes in page-title due to route-changes in legacy-app (this needs to be handled differently once we start moving UI)
window.addEventListener("languageChange", (evt) => {
    let rtlEnabled = evt.rtlEnabled;
    let element = document.querySelector('.application-container');
    if(rtlEnabled) {
        if (!element.classList.contains('rtl-namespace')) {
            element.classList.remove('ltr-namespace');
            element.classList.add('rtl-namespace');
        }
    } else {
        if (!element.classList.contains('ltr-namespace')) {
            element.classList.remove('rtl-namespace');
            element.classList.add('ltr-namespace');
        }
    }
});

window.addEventListener("layoutChange", (evt) => {
        let element = document.querySelector('.application-container');
        element.classList.remove(globalLayout);
        element.classList.add(evt.layout);
        globalLayout = evt.layout;
});

// Watching for startup of monetization
window.addEventListener("setPaymentPointer", (evt) => {
    if (evt.pointer && evt.pointer.length) {
        let donations = document.querySelector('[name="monetization"]');
        donations.content = evt.pointer;
    }
});
