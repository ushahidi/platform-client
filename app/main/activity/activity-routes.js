module.exports = [
    '$stateProvider',
function (
    $stateProvider
) {

    $stateProvider
    .state({
        name: 'activity',
        url: '/activity',
        controller: require('./activity.controller.js'),
        template: require('./activity.html')
    });
}];
