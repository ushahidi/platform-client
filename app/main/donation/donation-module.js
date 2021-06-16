angular
    .module("ushahidi.donation", [])

    .directive("donation", require("./donation.directive.js"))

    .directive("donationButton", require("./donation-button.directive.js"))

    .directive("donationModal", require("./donation-modal.directive.js"))

    .directive("donationToolbar", require("./donation-toolbar.directive.js"))

    .service("DonationService", require("./donation.service.js"));
