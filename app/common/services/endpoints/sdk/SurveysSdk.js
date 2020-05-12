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
    const ushahidi = new UshahidiSdk.Surveys(Util.url(''), token);
    const getSurveys = function(id) {
        return ushahidi
                    .setToken(Session.getSessionDataEntry('accessToken'))
                    .getSurveys(id);
    }

    const saveSurvey = function(survey) {
        return ushahidi
            .setToken(Session.getSessionDataEntry('accessToken'))
            .saveSurvey(survey);
    }

    return {getSurveys, saveSurvey};
}];
