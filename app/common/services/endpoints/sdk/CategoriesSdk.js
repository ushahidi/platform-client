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
        return new UshahidiSdk.Categories(
            Util.url(''),
            Session.getSessionDataEntry('accessToken'),
            Session.getSessionDataEntry('accessTokenExpires')
        );
    }

    const getCategories = function(id) {
        return ushahidi()
                    .getCategories(id);
    }

    const saveCategory = function(category) {
        return ushahidi()
            .saveCategory(category);
    }

    const deleteCategory = function(id) {
        return ushahidi()
                .deleteCategory(id);
    }

    return { getCategories, saveCategory, deleteCategory };
}];
