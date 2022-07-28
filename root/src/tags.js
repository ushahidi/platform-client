const privacyPolicyUrl = 'https://www.ushahidi.com/privacy-policy';

function init_klaro(consentConfig) {
    // Loading Klaro consent management
    window.klaroConfig = {
        testing: false,
        elementID: 'klaro',
        storageMethod: 'localStorage',
        storageName: 'klaro',

        /*
        If set to `true`, Klaro will render the texts given in the
        `consentModal.description` and `consentNotice.description` translations as HTML. This enables you to e.g. add custom links or interactive content.
        */
        htmlTexts: true,

        /*
        Defines the default state for services in the consent modal (true=enabled by default). You can override this setting in each service.
        */
        default: false,

        /*
        If 'mustConsent' is set to 'true', Klaro will directly display the consent manager modal and not allow the user to close it before having actively consented or declined the use of third-party services.
        */
        mustConsent: true,

        /*
        Setting 'acceptAll' to 'true' will show an "accept all" button in the notice and modal, which will enable all third-party services if the user clicks on it. If set to 'false', there will be an "accept" button that will only enable the services that are enabled in the consent modal.
        */
        acceptAll: true,

        /*
        Setting 'hideDeclineAll' to 'true' will hide the "decline" button in the consent modal and force the user to open the modal in order to change his/her consent or disable all third-party services. We strongly advise you to not use this feature, as it opposes the "privacy by default" and "privacy by design" principles of the GDPR (but might be acceptable in other legislations such as under the CCPA)
        */
        hideDeclineAll: false,

        /*
        Setting 'hideLearnMore' to 'true' will hide the "learn more / customize" link in the consent notice. We strongly advise against using this under most circumstances, as it keeps the user from customizing his/her consent choices.
        */
        hideLearnMore: false,

        /*
        You can overwrite existing translations and add translations for your service descriptions and purposes. See `src/translations/` for a full list of translations that can be overwritten: https://github.com/KIProtect/klaro/tree/master/src/translations
        */
        translations: {
            zz: {
                privacyPolicyUrl: privacyPolicyUrl
            },
            en: {
                privacyPolicyUrl: privacyPolicyUrl,
                consentModal: {
                    description:
                        'Here you can see and customize the information that we collect about you.'
                },
                acceptSelected: 'Save and close',
                purposes: {
                    functional: { title: 'Functional' },
                    analytics: { title: 'Analytics' },
                    security: { title: 'Security' },
                    livechat: { title: 'Livechat' },
                    advertising: { title: 'Advertising' },
                    styling: {
                        title: 'Styling'
                    },
                },
            }
        },

        /*
        Here you specify the third-party services that Klaro will manage for you.
        */
        services: []
    }

    if ((window.ushahidi && window.ushahidi.gaEnabled) || 
        (consentConfig.askModules && consentConfig.askModules.ga)) {
            init_klaro_service_ga();
    }

    /* KLARO-TEST
       these are commented out while we are trying direct-loading Klaro into the index.html (see index.ejs)
     */

//     let klaroDivE = document.createElement('div');
//     klaroDivE.id = 'klaro';
//     document.body.insertBefore(klaroDivE, document.body.firstChild);

//     let klaroE = document.createElement('script');
//     klaroE.type = 'application/javascript';
//     klaroE.src = 'https://cdn.kiprotect.com/klaro/v0.7/klaro.js';
//     document.head.appendChild(klaroE);
}

function init_klaro_service_ga() {
    window.klaroConfig.services.push({
        /*
        Each service must have a unique name. Klaro will look for HTML elements with a matching 'data-name' attribute to identify elements that belong to this service.
        */
        name: 'google-analytics',

        /*
         * If 'default' is set to 'true', the service will be enabled by default. This overrides the global 'default' setting.
         */
        default: false,

        /*
        Translations belonging to this service go here. The key `zz` contains default translations that will be used as a fallback if there are no translations defined for a given language.
        */
        translations: {
            zz: { title: 'Google Analytics' },
            en: { description: 'Google Analytics is Google\'s web analytics tool. This service is used for collecting information about site visitors, for measuring the performance of the site and service, and for optimizing the user experience in order to deliver a better service for site visitors.' }
        },

        /*
        The purpose(s) of this service that will be listed on the consent notice. Do not forget to add translations for all purposes you list here.
        */
        purposes: ['analytics'],

        cookies: [    
            /* 
            You can either only provide a cookie name or regular expression (regex) or a list consisting of a name or regex, a path and a cookie domain. Providing a path and domain is necessary if you have services that set cookies for a path that is not "/", or a domain that is not the current domain. If you do not set these values properly, the cookie can't be deleted by Klaro, as there is no way to access the path or domain of a cookie in JS. Notice that it is not possible to delete cookies that were set on a third-party domain, or cookies that have the HTTPOnly attribute: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#new-cookie_domain
            */
            [/^_(ga|gid).*$/],
            [/^FFPID$/],
            [/^_(ga|gid).*$/, '/', 'localhost'],
            [/^_(ga|gid).*$/, '/', 'localhost'],
        ],

        /*
        You can define an optional callback function that will be called each time the consent state for the given service changes. The consent value will be passed as the first parameter to the function (true=consented). The `service` config will be passed as the second parameter.
        */
        callback: function(consent, service) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'klaro',
                klaroGoogleAnalytics: consent
            });
        },

        /*
        If 'required' is set to 'true', Klaro will not allow this service to be disabled by the user. Use this for services that are always required for your website to function (e.g. shopping cart cookies).
        */
        required: false,

        /*
        If 'optOut' is set to 'true', Klaro will load this service even before the user has given explicit consent. We strongly advise against this.
        */
        optOut: false,

        /*
        If 'onlyOnce' is set to 'true', the service will only be executed once regardless how often the user toggles it on and off. This is relevant e.g. for tracking scripts that would generate new page view events every time Klaro disables and re-enables them due to a consent change by the user.
        */
        onlyOnce: false,
    }) 
}

function init_ga() {
    // Loading Google Analytics
    (function (i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
          i[r] ||
          function () {
              (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
        window,
        document,
        "script",
        "//www.google-analytics.com/analytics.js",
        "ga"
    );
    ga("create", window.ushahidi.gaKey, "auto");
    ga("send", "pageview");
}

function init_gtm() {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', window.ushahidi.googleTagManager);
}

function init_googlePlaces() {
    // Loading Google-Maps to enable use of Places-API
    (function (d, t, c, s) {
        var g = d.createElement(t);
        g.id = "mapsApi";
        g.type = "text/javascript";
        g.async = true;
        g.src =
            "https://maps.googleapis.com/maps/api/js?key=" +
            window.ushahidi.googleMapsApiKey +
            "&libraries=places";
        g.onload = c;
        g.onreadystatechange = c;
        s = d.getElementsByTagName(t)[0];
        s.parentNode.insertBefore(g, s);
    })(document, "script", function () {
        var e = document.createElement("div");
        e.style.display = "none";
        window.googlePlaces = new google.maps.places.PlacesService(e);
    });
}

export default function init() {
    if (window.ushahidi &&
        window.ushahidi.consentManagement &&
        window.ushahidi.consentManagement.enabled) {
            const consentConfig = window.ushahidi.consentManagement;
            if (consentConfig.manager === 'klaro') {
                init_klaro(consentConfig);
            }
    }
    if (window.ushahidi && window.ushahidi.gaEnabled) {
        init_ga();
    }
    if (window.ushahidi && window.ushahidi.googleTagManager) {
        init_gtm();
    }
    if (window.ushahidi && window.ushahidi.googleMapsApiKey) {
        init_googlePlaces();
    }
}
