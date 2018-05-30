import * as _ from "underscore";

window.ushahidi = window.ushahidi || {};

export default {
    currentUrl() {
        return window.location.href;
    },
    url(relativeUrl) {
        return window.ushahidi.backendUrl.replace(/\/$/, "") + relativeUrl;
    },
    apiUrl(relativeUrl) {
        return `${window.ushahidi.backendUrl.replace(
            /\/$/,
            ""
        )}/api/v3${relativeUrl}`;
    },
    deploymentUrl(relativeUrl) {
        const pattern = /^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/\n]+)/g;
        const deploymentUrl = pattern.exec(this.apiUrl(relativeUrl));
        return deploymentUrl[0].replace("api.", "");
    },
    transformResponse(response, omitKeys) {
        let omitKeysCopy = omitKeys;
        omitKeysCopy = (omitKeysCopy || []).concat(["allowed_methods"]);
        const json =
            typeof response === "string" ? JSON.parse(response) : response;
        return _.omit(json, omitKeysCopy);
    },
    // Generates a simple UUID for use on html tags when a unique ID is required
    // Usually applicable where you want to be able to select an element by its ID
    // but there is no id available
    /* eslint-disable */
    simpluUUID() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },
    /* eslint-enable */
    bindAllFunctionsToSelf(object) {
        // bind all functions on self to use self as their 'this' context
        const functions = _.functions(object);
        if (functions.length) {
            _.bindAll(...[object].concat(functions));
        }
        return object;
    },

    /*
 * This function returns a map of csv columns to post_type fields.
 * It checks for the presences of the columns names in the set of attribute labels.
 * If the column is not present the entry is set to undefined.
 *
 * The match is case insensistive.
 */
    autoMap(columns, attributes) {
        // Get set of labels
        const attributeLabels = _.map(attributes, attribute =>
            attribute.label.toLowerCase()
        );

        // Create map of labels to attribute keys
        const attributeKeys = _.pluck(attributes, "key");
        const attributeMap = _.object(attributeLabels, attributeKeys);

        // Check if a column name appears in the set of labels, if it does set a mapping
        // to the attribute, otherwise set the mapping to undefined.
        return _.map(columns, item => {
            const column = item.toLowerCase().trim();
            return _.contains(attributeLabels, column)
                ? attributeMap[item]
                : undefined;
        });
    }
};
