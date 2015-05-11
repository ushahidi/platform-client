module.exports = [
    '$translate',
function (
    $translate
) {

    return function (keys) {
        var translated = [];
        $translate(keys).then(function (result) {
            for (var key in result) {
                translated.push({
                    name: key.split('.').pop(),
                    title: result[key]
                });
            }
        });
        return translated;
    };

}];
