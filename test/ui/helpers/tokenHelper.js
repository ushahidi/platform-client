const fetch = require('node-fetch');

module.exports = {
    getAccessToken: async function (
        {grantType = 'client_credentials', username = null, password = null, scope = '*'}
    ) {
        let responseJson = null;

        await fetch(process.env.BACKEND_URL + '/oauth/token', {
            'credentials': 'omit',
            'headers': {
                'Content-Type': 'application/json;charset=utf-8'
            },
            'body': JSON.stringify({
                'grant_type': grantType,
                'username': username,
                'password': password,
                'client_id': process.env.OAUTH_CLIENT_ID,
                'client_secret': process.env.OAUTH_CLIENT_SECRET,
                'scope': scope
            }),
            'method': 'POST',
            'mode': 'cors'
        })
            .then(res => res.json())
            .then(json => responseJson = json);

        return responseJson;
    },

    getPublicAccessToken: async function () {
        let json = await this.getAccessToken({
            grant_type: 'client_credentials',
            scope: 'posts country_codes media forms api tags savedsearches sets users stats layers config messages notifications webhooks contacts roles permissions csv'
        });
        return json.access_token;
    }
};
