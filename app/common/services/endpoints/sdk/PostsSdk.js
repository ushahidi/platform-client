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

    const getPosts = function(id) {
        return ushahidi()
                .getPosts(id);
    }

    const savePost = function(post) {
        return ushahidi()
            .savePost(post);
    }

    const deletePost = function(id) {
        return ushahidi()
                .deletePost(id);
    }

    return { getPosts, savePost, deletePost };
}];
