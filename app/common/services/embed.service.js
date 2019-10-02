module.exports = [
    '_',
function (_) {
    return {isEmbed: (window.self !== window.top) ? true : false};
}];
