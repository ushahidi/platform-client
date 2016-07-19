module.exports = [
    'Util',
function (
    Util
) {
    var PostStatusService = {
        getStatuses: function () {
            return ['published', 'draft', 'archived'];
        }
    };

    return Util.bindAllFunctionsToSelf(PostStatusService);
}];
