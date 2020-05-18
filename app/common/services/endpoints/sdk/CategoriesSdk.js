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
    const ushahidi = new UshahidiSdk.Categories(Util.url(''), token);
    const getCategories = function(id) {
        return ushahidi
                    .setToken(Session.getSessionDataEntry('accessToken'))
                    .getCategories(id);
    }

    const saveCategory = function(category) {
        return ushahidi
            .setToken(Session.getSessionDataEntry('accessToken'))
            .saveCategory(category);
    }

    const deleteCategory = function(id) {
        return ushahidi
                .setToken(Session.getSessionDataEntry('accessToken'))
                .deleteCategory(id);
    }

    return {getCategories, saveCategory, deleteCategory};
}];
