module.exports = DonationService;

DonationService.$inject = ['$rootScope', 'Util', 'Notify', 'ModalService'];

function DonationService($rootScope, Util, Notify, ModalService) {
    let total = 0;
    let scale;

    function setupMonetization() {
        if (document.monetization) {
            document.monetization.addEventListener(
                'monetizationpending',
                () => {
                    Notify.notify('<p> Initializing Web Monetization . </p>');
                }
            );

            document.monetization.addEventListener(
                'monetizationstart',
                (event) => {
                    if (
                        event.detail.paymentPointer ===
                        $rootScope.donation.wallet
                    ) {
                        $rootScope.$broadcast('event:donation:started');

                        Notify.notify('<p> Web Monetization Started. </p>');
                    }
                }
            );

            document.monetization.addEventListener(
                'monetizationprogress',
                (event) => {
                    // initialize currency and scale on first progress event
                    if (total === 0) {
                        scale = event.detail.assetScale;
                    }

                    total += Number(event.detail.amount);

                    const formatted = (total * Math.pow(10, -scale)).toFixed(
                        scale
                    );

                    $rootScope.donation.assetCode = event.detail.assetCode;
                    $rootScope.donation.formattedAmount = formatted;

                    $rootScope.$emit('setDonatedAmount', formatted);
                }
            );

            document.monetization.addEventListener('monetizationstop', () => {
                Notify.notify('<p> Web Monetization Stopped. </p>');
            });
        }
    }

    function disableMonetization() {
        if (document.monetization) {
            // Write something
        }
    }

    function openDonationModal() {
        ModalService.openTemplate(
            '<donation-modal donation="donation"> </donation-modal>',
            $rootScope.donation.title,
            false,
            $rootScope,
            true,
            true,
            true
        );
    }

    return {
        disableMonetization,
        setupMonetization,
        openDonationModal
    };
}
