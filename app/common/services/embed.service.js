module.exports = function () {
    return {isEmbed: (window.self !== window.top) ? true : false};
};
