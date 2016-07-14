module.exports = [
    'Util',
function (
    Util
) {
    var PostStatusService = {
        getStatuses: function () {
            return ['published', 'under_review', 'archived'];
        }
    };

    return Util.bindAllFunctionsToSelf(PostStatusService);
}];
