module.exports = [
    'Util',
    'Session',
    'UshahidiSdk',
function (
    Util,
    Session,
    UshahidiSdk
) {

    let _ushahidi = null;

    const ushahidi = function () {
        if (_ushahidi) { return _ushahidi; }
        return new UshahidiSdk.Posts(
            Util.url(''),
            Session.getSessionDataEntry('accessToken'),
            Session.getSessionDataEntry('accessTokenExpires')
        );
    }

    const findPost = function(id) {
        return ushahidi()
                .findPost(id);
    }

    const getPosts = function() {
        return ushahidi()
            .getPosts();
    }
    /**
     * @TODO: Discussion on JS API needed: savePost works on both PUT and POST, as
     * we defined it that way for the SDK, but I'm not convinced we made the right
     * call here. I think explicit calls would be best for readability down the line.
     * @param post
     * @returns {void|undefined|{then: then}|*}
     */
    const savePost = function(post) {
        return ushahidi()
            .savePost(post);
    }
    const patchPost = function (post) {
        return ushahidi()
            .patchPost(post);
    }
    const bulkPatch = function (items) {
        return ushahidi()
            .bulkPatch(items);
    }
    const deletePost = function(id) {
        return ushahidi()
                .deletePost(id);
    }
    const bulkDelete = function (ids) {
        return ushahidi()
                .bulkDelete(ids.map(i => { return {id: i} }));
    }
    return { findPost, getPosts, savePost, bulkDelete, deletePost, bulkPatch, patchPost };
}];
