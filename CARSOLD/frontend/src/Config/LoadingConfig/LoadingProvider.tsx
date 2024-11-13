import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

//defines type for loading context
interface LoadingContextType {
    isAppLoading: boolean;
    setAppLoading: (state: boolean) => void;
}

//creates loading context
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

//creates provider-component which is then used in 'App' and wraps other components
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false);

    //provides loading state and setter function
    const setAppLoading = useCallback((state: boolean) => {
        setIsAppLoading(state);
    }, []);

    //makes values accessible for all LoadingProvider children
    return (
        <LoadingContext.Provider value={{ isAppLoading, setAppLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

//custom hook to access the loading state
export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};