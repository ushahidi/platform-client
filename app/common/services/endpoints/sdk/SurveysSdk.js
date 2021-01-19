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
        return new UshahidiSdk.Surveys(
            Util.url(''),
            Session.getSessionDataEntry('accessToken'),
            Session.getSessionDataEntry('accessTokenExpires')
        );
    }
    const getSurveys = function(id) {
        return ushahidi()
                    .getSurveys(id);
    }

    const saveSurvey = function(survey) {
        return ushahidi()
            .saveSurvey(survey);
    }

    const deleteSurvey = function(id) {
        return ushahidi()
                .deleteSurvey(id);
    }

    return { getSurveys, saveSurvey, deleteSurvey };
}];
