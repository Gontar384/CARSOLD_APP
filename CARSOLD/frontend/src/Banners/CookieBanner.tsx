import React, {useState} from "react";

//cookie info banner
const CookieBanner: React.FC = () => {
    const [visible, setVisible] = useState<boolean>(true);

    //hides banner
    const handleDismiss = () => {
        setVisible(false);
        localStorage.setItem('cookie-banner', 'accepted');
    };

    //displays when localstorage is empty, so basically on user's first visit on page
    if (visible && !localStorage.getItem('cookie-banner')) {
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