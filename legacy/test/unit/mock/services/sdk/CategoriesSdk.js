module.exports = [function () {
    return {
        getCategories: function (id) {
            return {
                then: function (successCallback, failCallback) {
                    if (id) {
                         successCallback({
                                    'id':1,
                                    'parent_id':null,
                                    'tag':'Test category',
                                    'slug':'test-category',
                                    'type':'category',
                                    'color':'',
                                    'icon':'tag',
                                    'description':'Test description',
                                    'role':null,
                                    'priority':99,
                                    'children':[],
                                    'parent':null,
                                    'translations':{'it':{'tag':'test-tag in italian','description':'description in italian'},'sw':{'tag':'test tag in swahili','description':'test-description in swahili'}},
                                    'enabled_languages':{'default':'en','available':['it','sw']
                                }
                        });
                    } else {
                        successCallback([{
                            'id':1,
                            'parent_id':null,
                            'tag':'Test category',
                            'slug':'test-category',
                            'type':'category',
                            'color':'',
                            'icon':'tag',
                            'description':'Test description',
                            'role':null,
                            'priority':99,
                            'children':[],
                            'parent':null,
                            'translations':{'it':{'tag':'test-tag in italian','description':'description in italian'},'sw':{'tag':'test tag in swahili','description':'test-description in swahili'}},
                            'enabled_languages':{'default':'en','available':['it','sw']}
                        },{
                            'id':2,
                            'parent_id':null,
                            'tag':'Test category 2',
                            'slug':'test-category 2',
                            'type':'category',
                            'color':'',
                            'icon':'tag',
                            'description':'Test description 2',
                            'role':null,
                            'priority':99,
                            'children':[],
                            'parent':null,
                            'translations':{'es':{'tag':'test-tag in spanish 2','description':'description in spanish 2'},'sw':{'tag':'test tag in swahili 2','description':'test-description in swahili 2'}},
                            'enabled_languages':{'default':'en','available':['es','sw']}
                        }]);
                    }
                }
            };
        },
        saveCategory: function (category) {
            return  {
                then: function (successCallback, failCallback) {
                    if (category.id !== 'fail') {
                        successCallback({id: 1, enabled_languages: {default: 'en', available: ['it', 'sw']}, slug:'test-category', tag:'test tag'})
                    } else {
                        failCallback({error:'error'});
                    }
                }
            };
        },
        deleteCategory: function () {
            return  {
                then: function (successCallback, failCallback) {
                    successCallback({id: 1});
                }
            }
        }
    };
}];
