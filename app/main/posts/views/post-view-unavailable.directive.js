module.exports = [
function (
) {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            view: '='
        },
        template: require('./post-view-unavailable.html')
    };
}];
