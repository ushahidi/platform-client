module.exports = [
    'Util',
    'UshahidiSdk',
function (
    Util,
    UshahidiSdk
) {

    const url = Util.url('');
    const getLanguages = function() {
        return UshahidiSdk.getLanguages(url);
    }

    return {getLanguages};
}];
