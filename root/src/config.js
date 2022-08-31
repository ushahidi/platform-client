// Configure your Ushahidi deployment
//
// Uncomment lines below to configure your deployment
// window.ushahidi = {
// 	backendUrl : "https://ushahidi-platform-api-release.herokuapp.com",
// 	mapboxApiKey: ""
// };
window.ushahidi = {
    sources: ['sms', 'twitter', 'web', 'email', 'whatsapp', 'ussd']
};
