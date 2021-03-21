module.exports = DonationService;

DonationService.$inject = [
    'Util',
    'ConfigEndpoint',
    '$rootScope'
];

function DonationService(
    Util,
    ConfigEndpoint,
    $rootScope
) {
    var DonationService = {

    };

    return Util.bindAllFunctionsToSelf(DonationService);
}
