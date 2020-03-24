const {client} = require('nightwatch-api');
const util = require('util');

module.exports = {
    url: function () {
        return this.api.launchUrl + '/views/data';
    },
    elements: {
        posts: {
            selector: '//article[@class="postcard"]',
            locateStrategy: 'xpath'
        },
        paginationInformation: {
            selector: '//div[@translate="post.posts_total"]',
            locateStrategy: 'xpath'
        },
        postCardByTitle: {
            selector: '//div[@class="postcard-title" and .//bdi/text()="%s"]/ancestor::article[@class="postcard"]',
            locateStrategy: 'xpath'
        },
        dropdownButtonInPostCard: {
            selector: '//button',
            locateStrategy: 'xpath'
        },
        deleteButtonInPostCard: {
            selector: '//span[@translate="nav.delete"]/ancestor::li',
            locateStrategy: 'xpath'
        },
        deleteConfirmButton: {
            selector: '//modal-content//span[@translate="app.delete"]',
            locateStrategy: 'xpath'
        },
        messageSlider: {
            selector: '//ush-slider//div[@class="message-body"]',
            locateStrategy: 'xpath'
        },
        loadMoreButton: {
            selector: '//button[@translate="app.load_more"]',
            locateStrategy: 'xpath'
        },
        loadingDots: {
            selector: '//loading-dots',
            locateStrategy: 'xpath'
        },
        dismissButton: {
            selector: '//ush-slider[not(@inside-modal="true")]//button[@translate="message.button.dismiss"]',
            locateStrategy: 'xpath'
        }
    },
    commands: {
        getPaginationInformation: async function () {
            let text = '';
            await this.getText(
                '@paginationInformation',
                function (result) {
                    text = result.value
                });
            return text;
        },
        deleteSinglePost: function (title) {
            let postcardXpath = util.format(this.elements.postCardByTitle.selector, title);
            let dropdownButton = {
                selector: postcardXpath + this.elements.dropdownButtonInPostCard.selector,
                locateStrategy: this.elements.postCardByTitle.locateStrategy
            };
            let deleteButton = {
                selector: postcardXpath + this.elements.deleteButtonInPostCard.selector,
                locateStrategy: this.elements.postCardByTitle.locateStrategy
            };
            return this.click(dropdownButton)
                .waitForElementVisible(deleteButton)
                .click(deleteButton)
                .waitForElementVisible('@deleteConfirmButton')
                .click('@deleteConfirmButton')
                .waitForElementNotPresent('@deleteConfirmButton')
                .waitForElementVisible('@messageSlider');
        },
        getPostCount: async function () {
            let count = 0;
            await this
                .api.elements(
                    '@posts',
                    function (result) {
                        count = result.value.length
                    });
            return count
        },
        loadMore: function () {
            return this.click({
                selector: '@dismissButton',
                suppressNotFoundErrors: true
            })
                .waitForElementNotVisible('@dismissButton')
                .waitForElementNotVisible('@loadingDots')
                .waitForElementVisible('@loadMoreButton')
                .click('@loadMoreButton')
                .waitForElementVisible({selector: '@loadingDots', abortOnFailure: false})
                .waitForElementNotVisible('@loadingDots')
        }
    }
};
