const {Given} = require('cucumber');
const {client} = require('nightwatch-api');

Given('the administrator has logged in to the webUI', async function () {
    await client
        .page
        .ushahidiPage()
        .navigate()
        .openLoginScreen();
    return client
        .page
        .loginContainer()
        .login(client.globals.admin_username,client.globals.admin_password)
});
