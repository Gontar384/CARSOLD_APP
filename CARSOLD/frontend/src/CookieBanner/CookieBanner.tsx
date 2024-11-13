import {useCookieBanner} from "./CookieBannerProvider.tsx";

//cookie info banner
const CookieBanner = () => {
    const { showBanner, setShowBanner } = useCookieBanner();

    //hides banner
    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('cookie-banner-dismissed', 'true');
    };

    if (showBanner && !localStorage.getItem('cookie-banner-dismissed')) {
        return (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-lowBlack
              text-sm sm1:text-base text-white text-center z-50">
                <p>We use cookies for security purposes. By using our site, you consent to our use of cookies.</p>
                <button onClick={handleDismiss} className="mt-2 px-4 py-2 bg-lime text-white rounded">
                    Got it!
                </button>
            </div>
        );
    }
    return null;
};

export default CookieBanner;