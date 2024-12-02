import React, {createContext, useContext, useEffect, useState} from 'react';
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";

interface AuthContextType {
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
    loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//manages authentication and adds loading screen
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

    //checks authentication
    const checkAuth = async () => {
        setLoadingAuth(true);
        try {
            const response = await api.get(`api/auth/check-authentication`);
            const authState = response.data['isAuth'];
            localStorage.setItem('Authenticated', authState ? 'true' : 'false');
            setIsAuthenticated(authState);
        } catch (error) {
            console.error("Error checking authentication: ", error);
            setIsAuthenticated(false);
        } finally {
            setLoadingAuth(false);
        }
    };

    //updates auth state
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'Authenticated') {
                const newAuthState: boolean = event.newValue === 'true';
                setIsAuthenticated(newAuthState);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        checkAuth().then();
    }, []);

    return (
        <AuthContext.Provider value={{isAuthenticated, checkAuth, loadingAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context: AuthContextType | undefined = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
