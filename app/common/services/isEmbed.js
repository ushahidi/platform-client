export default () => {
    return (window.self !== window.top) ? true : false;
};
