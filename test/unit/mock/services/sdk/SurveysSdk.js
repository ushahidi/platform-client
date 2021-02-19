module.exports = [function () {
    return {
        getSurveys: function (id) {
            return {
                then: function (successCallback, failCallback) {
                    if (id) {
                        successCallback({
                            'id': 1,
                            'enabled_languages': {'default': 'en','available' : ['es']},
                            'type': 'report',
                            'name':'test form',
                            'description':'Testing form',
                            'translations':{'es':{'name':'','description':''}},
                            'tasks': [{'id': 1,'fields': [{'id':1}, {'id':2}]}]
                        });
                    } else {
                        successCallback([
                            {
                                'id': 1,
                                'enabled_languages': {'default': 'en','available' : ['es']},
                                'type': 'report',
                                'name':'test form 1',
                                'description':'Testing form 1',
                                'translations':{'es':{'name':'Testing form in spanish 1','description':'Testing description in spanish 1'}}
                            },
                            {
                                'id': 2,
                                'enabled_languages': {'default': 'en','available' : ['it']},
                                'type': 'report',
                                'name':'test form 2',
                                'description':'Testing form 2',
                                'translations':{'it':{'name':'Testing form in italian 2','description':'Testing description in italian 2'}}
                            }
                        ]);
                    }
                }
            }},
        getSurveysTo: function (id, reason) {
            return {
                then: function (successCallback, failCallback) {
                    if (id) {
                        successCallback({
                            'id': 1,
                            'enabled_languages': {'default': 'en','available' : ['es']},
                            'type': 'report',
                            'name':'test form',
                            'description':'Testing form',
                            'translations':{'es':{'name':'','description':''}},
                            'tasks': [{'id': 1,'fields': [{'id':1}, {'id':2}]}]
                        });
                    } else {
                        successCallback([
                            {
                                'id': 1,
                                'enabled_languages': {'default': 'en','available' : ['es']},
                                'type': 'report',
                                'name':'test form 1',
                                'description':'Testing form 1',
                                'translations':{'es':{'name':'Testing form in spanish 1','description':'Testing description in spanish 1'}}
                            },
                            {
                                'id': 2,
                                'enabled_languages': {'default': 'en','available' : ['it']},
                                'type': 'report',
                                'name':'test form 2',
                                'description':'Testing form 2',
                                'translations':{'it':{'name':'Testing form in italian 2','description':'Testing description in italian 2'}}
                            }
                        ]);
                    }
                }
            }
        },
        findSurveyTo: function () {
            return {
                then: function (successCallback, failCallback) {
                    successCallback({
                        'id': 1,
                        'enabled_languages': {'default': 'en','available' : ['es']},
                        'type': 'report',
                        'name':'test form',
                        'description':'Testing form',
                        'translations':{'es':{'name':'','description':''}},
                        'tasks': [{'id': 1,'fields': [{'id':1}, {'id':2}]}]
                    });
                }
            }
        },
        saveSurvey: function () {
            return  {
                then: function (successCallback, failCallback) {
                    successCallback({id: 1});
                }
            }
        }
    }
}];
