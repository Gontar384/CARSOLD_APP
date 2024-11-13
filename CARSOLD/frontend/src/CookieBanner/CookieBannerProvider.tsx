import React, {createContext, ReactNode, useContext, useState} from "react";

interface CookieBannerContextType {
    showBanner: boolean;
    setShowBanner: React.Dispatch<React.SetStateAction<boolean>>;
}

const CookieBannerContext = createContext<CookieBannerContextType | undefined>(undefined);

export const CookieBannerProvider = ({children}: {children: ReactNode}) => {
    const [showBanner, setShowBanner] = useState<boolean>(false);

    return (
        <CookieBannerContext.Provider value={{ showBanner, setShowBanner }}>
            {children}
        </CookieBannerContext.Provider>
    );
}

export const useCookieBanner = (): CookieBannerContextType => {
    const context = useContext(CookieBannerContext);
    if (!context) {
        throw new Error("useCookieBanner must be used within an CookieBannerProvider");
    }
    return context;
}