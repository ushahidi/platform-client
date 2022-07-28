// Configure your Ushahidi deployment
//
// Uncomment lines below to configure your deployment
// window.ushahidi = {
// 	backendUrl : "https://ushahidi-platform-api-release.herokuapp.com",
// 	mapboxApiKey: "",
//  consentManagement: {
//    enabled: true,
//    manager: 'klaro',
//    askModules: {
//      ga: true,  // for google analytics
//    }
//  }
// };
window.ushahidi = {
    googleTagManager: 'GTM-PS6B8C6',
    consentManagement: {
        enabled: true,
        manager: 'klaro',
        askModules: {
            ga: true
        }
    }
};
