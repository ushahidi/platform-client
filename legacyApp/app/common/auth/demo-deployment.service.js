module.exports = [
    'ConfigEndpoint',
    'Notify',
function (
    ConfigEndpoint,
    Notify
) {
    return {
        demoCheck: function () {
            ConfigEndpoint.get({id: 'site'}).$promise.then(function (site) {
                if (site.tier === 'demo_1') {
                    Notify.demo();
                }
            });
        }
    };
}];

