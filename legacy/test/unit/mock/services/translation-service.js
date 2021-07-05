module.exports = ['$q',
function ($q) {
    return {
        translate: function (language) {},
        setStartLanguage: function () {},
        getLanguage: function () {
            return $q(function (resolve, reject) {
                resolve('en');
            });
        },
        setLanguage: function () {}
    };
}];
