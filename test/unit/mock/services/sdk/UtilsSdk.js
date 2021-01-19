module.exports = [
    'Util',
    function (
        Util
    ) {
        const url = Util.url('');
        const getLanguages = function() {
            return { then: function () {
                return [{'code':'ach','name':'Acoli'},{'code':'ady','name':'Adyghe'},{'code':'af','name':'Afrikaans'}];
            }
        }
    }
    return {getLanguages};
    }
];
