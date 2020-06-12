const {setDefaultTimeout, After, Before} = require('cucumber')
const {createSession, closeSession, startWebDriver, stopWebDriver} = require('nightwatch-api')
const fetch = require('node-fetch');
const tokenHelper = require('./helpers/tokenHelper');
const {client} = require('nightwatch-api');

setDefaultTimeout(60000);

let super_admin_access_token = null;

Before(async () => {
    await startWebDriver({});
    await createSession({});

    if (super_admin_access_token === null) {
        let responseJson = await tokenHelper.getAccessToken(
            {
                grantType: 'password',
                username: client.globals.super_admin_username,
                password: client.globals.super_admin_password
            }
        );
        super_admin_access_token = responseJson.access_token
    }

    //create an admin user
    await fetch(process.env.BACKEND_URL + '/api/v3/users', {
        'headers': {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + super_admin_access_token
        },
        'body': JSON.stringify({
            role: 'admin',
            email: client.globals.admin_username,
            realname: 'admin user for ui tests',
            password: client.globals.admin_password
        }),
        'method': 'POST'
    });

    //delete all posts
    let responseJson = await tokenHelper.getAccessToken(
        {grantType: 'password', username: client.globals.admin_username, password: client.globals.admin_password}
    );

    let altToken = responseJson.access_token;

    await fetch(process.env.BACKEND_URL + '/api/v3/posts?has_location=all&source%5B%5D=sms&source%5B%5D=twitter&source%5B%5D=web&source%5B%5D=email&status%5B%5D=published&status%5B%5D=draft', {
        'headers': {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + altToken
        },
        'method': 'GET'
    })
        .then(res => res.json())
        .then(async json => {
                let posts = json.results;
                for (let i = 0; i < posts.length; i++) {
                    await fetch(posts[i].url, {
                        'headers': {
                            'Content-Type': 'application/json;charset=utf-8',
                            'Authorization': 'Bearer ' + altToken
                        },
                        'method': 'DELETE'
                    });
                }
            },
            err => { /*ignore errors*/
            })
});
After(async () => {
    await closeSession();
    await stopWebDriver();

    //delete the admin user
    await fetch(process.env.BACKEND_URL + '/api/v3/users?q=' + client.globals.admin_username, {
        'headers': {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + super_admin_access_token
        },
        'method': 'GET'
    })
        .then(res => res.json())
        .then(async json => {
            if (json.results[0] !== undefined) {
                await fetch(process.env.BACKEND_URL + '/api/v3/users/' + json.results[0].id, {
                    'headers': {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': 'Bearer ' + super_admin_access_token
                    },
                    'method': 'DELETE'
                })
            }
        });
});
