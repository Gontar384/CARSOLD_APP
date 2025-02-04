import React, {useEffect, useState} from 'react';
import {AuthContext} from './useAuth.ts';
import {getAuthCheck, getLogout} from "../../ApiCalls/Service/UserService.ts";
import {BadRequestError} from "../../ApiCalls/Errors/CustomErrors.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

    const checkAuth = async () => {
        setLoadingAuth(true);
        try {
            const response = await getAuthCheck();
            const authState = response.status === 200;
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

        checkAuth();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const logout = async () => {
        try {
            await getLogout();
            await checkAuth();
        } catch (error: unknown) {
            if (error instanceof BadRequestError) {
                console.log("Error during logout: ", error);
            } else {
                console.error("Unexpected error during logout: ", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, checkAuth, loadingAuth, logout}}>
            {children}
        </AuthContext.Provider>
    );
};