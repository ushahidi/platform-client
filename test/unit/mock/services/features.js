module.exports = [function () {
    return {
        loadFeatures: function () {
            return {
                then: function (successCallback, failCallback) {
                    successCallback({
                        id: 'features',
                        url: 'http://192.168.33.110/api/v3/config/features',
                        'data-import': {
                            enabled: true
                        },
                        'data-providers': {
                            email: true,
                            frontlinesms: true,
                            nexmo: true,
                            smssync: true,
                            twilio: true,
                            twitter: true
                        },
                        limits: {
                            admin_users: true,
                            forms: true,
                            posts: true
                        },
                        'private': {
                            enabled: true
                        },
                        roles: {
                            enabled: true
                        },
                        views: {
                            activity: true,
                            chart: true,
                            list: true,
                            map: true,
                            plans: false,
                            timeline: true
                        }
                    });
                }
            };
        },
        isFeatureEnabled: function (feature) {},
        isViewEnabled: function (feature) {},
        getLimit: function (feature) {},
        features: {
            id: 'features',
            url: 'http://192.168.33.110/api/v3/config/features',
            'data-import': {
                enabled: true
            },
            'data-providers': {
                email: true,
                frontlinesms: true,
                nexmo: true,
                smssync: true,
                twilio: true,
                twitter: true
            },
            limits: {
                admin_users: true,
                forms: true,
                posts: true
            },
            'private': {
                enabled: true
            },
            roles: {
                enabled: true
            },
            views: {
                activity: true,
                chart: true,
                list: true,
                map: true,
                plans: false,
                timeline: true
            }
        }
    };
}];
