import React, {createContext, useContext} from "react";

interface UtilContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    lowerBar: boolean;
    setLowerBar: React.Dispatch<React.SetStateAction<boolean>>;
    midBar: boolean;
    setMidBar: React.Dispatch<React.SetStateAction<boolean>>;
    mobileWidth: boolean;
    midWidth: boolean;
    bigWidth: boolean;
    CreateDebouncedValue: <T>(value: T, delay: number) => T;
    isMobile: boolean;
}

export const UtilContext = createContext<UtilContextType | undefined>(undefined);

export const useUtil = (): UtilContextType => {
    const context = useContext(UtilContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a UtilProvider');
    }
    return context;
};