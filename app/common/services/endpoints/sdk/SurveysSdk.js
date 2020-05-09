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
        return ushahidi.getSurveys(id);
    }

    const saveSurvey = function(survey) {
        return ushahidi.saveSurvey(survey);
    }

    return {getSurveys, saveSurvey};
}];
