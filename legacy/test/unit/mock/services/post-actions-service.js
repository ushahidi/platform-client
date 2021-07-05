module.exports = [function () {
    return {
        delete: function (post) {
            return {
                then: function () {}
            };
        },
        getStatuses: function () {
            return ['published', 'draft', 'archived'];
        }
    };
}];
