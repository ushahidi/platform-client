const {Given, When, Then} = require('cucumber');
const {client} = require('nightwatch-api');
const fetch = require('node-fetch');
const assert = require('assert');
const tokenHelper = require('../helpers/tokenHelper');
const postsHelper = require('../helpers/postsHelper');


Given('these posts have been created by the public:', async function (dataTable) {
    const posts = dataTable.hashes();
    let token = await tokenHelper.getPublicAccessToken();
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        await postsHelper.createPost({title: post.title, content: post.content, access_token: token})
    }
    return client
});

Given('{int} posts have been created by the public with the title {string}, and the content {string}', async function (count, title, content) {
    let token = await tokenHelper.getPublicAccessToken();
    for (let i = 0; i < count; i++) {
        await postsHelper.createPost({title: title, content: content, access_token: token})
    }
    return client
});

Given('the administrator has opened the data-view on the webUI', function () {
    return client
        .page
        .dataViewPage()
        .navigate()
        .waitForElementVisible('@paginationInformation')
});

When('the administrator deletes the post with the title {string} using the webUI', function (title) {
    return client
        .page
        .dataViewPage()
        .deleteSinglePost(title)
});

When('the administrator loads more posts using the webUI', function () {
    return client
        .page
        .dataViewPage()
        .loadMore()
});

Then('the post-count header on the webUI should show {string}', async function (expectedText) {
    let actualText = await client
        .page
        .dataViewPage()
        .getPaginationInformation();

    assert.strictEqual(actualText, expectedText);
});

Then('there should be {int} posts listed on the webUI', async function (expectedAmountOfPosts) {
    let actualCount = await client
        .page
        .dataViewPage()
        .getPostCount();

    assert.strictEqual(actualCount, expectedAmountOfPosts);
});

Then('there should be no load-more button', function () {
    return client
        .page
        .dataViewPage()
        .waitForElementNotVisible('@loadMoreButton')
});

Then('there should be a load-more button visible', function () {
    return client
        .page
        .dataViewPage()
        .waitForElementVisible('@loadMoreButton')
});
