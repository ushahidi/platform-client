module.exports = [
    'Util',
    'Session',
    'UshahidiSdk',
function (
    Util,
    Session,
    UshahidiSdk
) {

    const token = Session.getSessionDataEntry('accessToken');
    const ushahidi = new UshahidiSdk.Posts(Util.url(''), token);

    const getPosts = function(id) {
        return ushahidi
                .setToken(Session.getSessionDataEntry('accessToken'))
                .getPosts(id);
    }

    const savePost = function(post) {
        return ushahidi
            .setToken(Session.getSessionDataEntry('accessToken'))
            .savePost(post);
    }

    const deletePost = function(id) {
        return ushahidi
                .setToken(Session.getSessionDataEntry('accessToken'))
                .deletePost(id);
    }

    return {getPosts, savePost, deletePost};
}];
