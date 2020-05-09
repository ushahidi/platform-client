module.exports = [function () {
    return {
        getSurveys: function (id) {
            return {
                then: function (successCallback, failCallback) {
                    if (id) {
                        successCallback({
                            'enabled_languages': {
                                    'default': 'en',
                                    'available' : ['es']
                                        },
                                'id': 9,
                                'parent_id': null,
                                'color': null,
                                'type': 'report',
                                'disabled': false,
                                'hide_author': false,
                                'hide_time': false,
                                'hide_location': false,
                                'require_approval': true,
                                'everyone_can_create': true,
                                'targeted_survey': false,
                                'can_create': [],
                                'name':'Namn pa enkäten',
                                'description':'Beskrivning',
                                'translations':{'es':{'name':'','description':''}},
                                'tags': [],
                                'tasks':[{
                                    'description': null,
                                    'form_id': 9,
                                    'icon': null,
                                    'id': 9,
                                    'priority': 0,
                                    'required': false,
                                    'show_when_published': true,
                                    'task_is_internal_only': false,
                                    'type': 'post',
                                            'label':'',
                                    'description':'',
                                    'translations':{'es':{'label':'','description':''}},
                                    'fields':[
                                        {
                                            'cardinality': 0,
                                            'config': [],
                                            'form_stage_id': 9,
                                            'id': 36,
                                            'input': 'text',
                                            'key': 'c3104844-3623-482a-ae06-2bbae6a91aeb',
                                            'priority': 1,
                                            'required': true,
                                            'response_private': false,
                                            'type': 'title',
                                            'label':'Title',
                                            'instructions':'',
                                            'options':[],
                                            'default':'',
                                            'translations': {'es':{'label':'Title in Spanish', 'instructions':'', 'options':[], 'default':''}}
                                        },{
                                            'cardinality': 0,
                                            'config': [],
                                            'form_stage_id': 9,
                                            'id': 37,
                                            'input': 'text',
                                            'key': '0fe7fa4d-91a6-4662-b21d-a397a37efeb0',
                                            'priority': 2,
                                            'label':'Description',
                                            'instructions':'',
                                            'options':[],
                                            'default':'',
                                            'required': true,
                                            'response_private': false,
                                            'type': 'description',
                                            'translations': {'es':{'label':'Description in Spanish'}}
                                        }
                                    ]
                                }
                            ]
                        });
                    } else {
                        successCallback([{
                            'enabled_languages': {
                                    'default': 'en',
                                    'available' : ['es']
                                        },
                                'id': 10,
                                'parent_id': null,
                                'color': null,
                                'type': 'report',
                                'disabled': false,
                                'hide_author': false,
                                'hide_time': false,
                                'hide_location': false,
                                'require_approval': true,
                                'everyone_can_create': true,
                                'targeted_survey': false,
                                'can_create': [],
                                'name':'Namn pa enkäten',
                                'description':'Beskrivning',
                                'translations':{'es':{'name':'','description':''}},
                                'tags': [],
                                'tasks':[{
                                    'description': null,
                                    'form_id': 9,
                                    'icon': null,
                                    'id': 9,
                                    'priority': 0,
                                    'required': false,
                                    'show_when_published': true,
                                    'task_is_internal_only': false,
                                    'type': 'post',
                                            'label':'',
                                    'description':'',
                                    'translations':{'es':{'label':'','description':''}},
                                    'fields':[
                                        {
                                            'cardinality': 0,
                                            'config': [],
                                            'form_stage_id': 9,
                                            'id': 36,
                                            'input': 'text',
                                            'key': 'c3104844-3623-482a-ae06-2bbae6a91aeb',
                                            'priority': 1,
                                            'required': true,
                                            'response_private': false,
                                            'type': 'title',
                                            'label':'Title',
                                            'instructions':'',
                                            'options':[],
                                            'default':'',
                                            'translations': {'es':{'label':'Title in Spanish', 'instructions':'', 'options':[], 'default':''}}
                                        },{
                                            'cardinality': 0,
                                            'config': [],
                                            'form_stage_id': 9,
                                            'id': 37,
                                            'input': 'text',
                                            'key': '0fe7fa4d-91a6-4662-b21d-a397a37efeb0',
                                            'priority': 2,
                                            'label':'Description',
                                            'instructions':'',
                                            'options':[],
                                            'default':'',
                                            'required': true,
                                            'response_private': false,
                                            'type': 'description',
                                            'translations': {'es':{'label':'Description in Spanish'}}
                                        }
                                    ]
                                }
                            ]
                        },{
                            'enabled_languages': {
                                    'default': 'en',
                                    'available' : ['es']
                                        },
                                'id': 9,
                                'parent_id': null,
                                'color': null,
                                'type': 'report',
                                'disabled': false,
                                'hide_author': false,
                                'hide_time': false,
                                'hide_location': false,
                                'require_approval': true,
                                'everyone_can_create': true,
                                'targeted_survey': false,
                                'can_create': [],
                                'name':'Namn pa enkäten',
                                'description':'Beskrivning',
                                'translations':{'es':{'name':'','description':''}},
                                'tags': [],
                                'tasks':[{
                                    'description': null,
                                    'form_id': 9,
                                    'icon': null,
                                    'id': 9,
                                    'priority': 0,
                                    'required': false,
                                    'show_when_published': true,
                                    'task_is_internal_only': false,
                                    'type': 'post',
                                            'label':'',
                                    'description':'',
                                    'translations':{'es':{'label':'','description':''}},
                                    'fields':[
                                        {
                                            'cardinality': 0,
                                            'config': [],
                                            'form_stage_id': 9,
                                            'id': 36,
                                            'input': 'text',
                                            'key': 'c3104844-3623-482a-ae06-2bbae6a91aeb',
                                            'priority': 1,
                                            'required': true,
                                            'response_private': false,
                                            'type': 'title',
                                            'label':'Title',
                                            'instructions':'',
                                            'options':[],
                                            'default':'',
                                            'translations': {'es':{'label':'Title in Spanish', 'instructions':'', 'options':[], 'default':''}}
                                        },{
                                            'cardinality': 0,
                                            'config': [],
                                            'form_stage_id': 9,
                                            'id': 37,
                                            'input': 'text',
                                            'key': '0fe7fa4d-91a6-4662-b21d-a397a37efeb0',
                                            'priority': 2,
                                            'label':'Description',
                                            'instructions':'',
                                            'options':[],
                                            'default':'',
                                            'required': true,
                                            'response_private': false,
                                            'type': 'description',
                                            'translations': {'es':{'label':'Description in Spanish'}}
                                        }
                                    ]
                                }
                            ]
                        }]);
                    }
                }
            }},
        saveSurvey: function () {
            return  {
                then: function (successCallback, failCallback) {
                    successCallback({id: 1});
                }
            }
        }
    }
}];
