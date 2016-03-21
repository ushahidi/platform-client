module.exports = [function () {
    return {
        features: {
            views: {
                activity: true
            },
            limits: {
                forms: 1
            },
            roles: {
                enabled: true
            },
            'data-import': {
                csv: {
                    enabled: true
                }
            }
        },
        site: {
            name: 'test',
            tier: '1',
            language: 'en'
        },
        map: {

        }
    };
}];
