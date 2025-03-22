import React, {useEffect, useState} from 'react';
import {AuthContext} from './useAuth.ts';
import {InternalServerError} from "../../ApiCalls/Errors/CustomErrors.ts";
import {checkAuth, logout} from "../../ApiCalls/Services/UserService.ts";
import {useNavigate} from "react-router-dom";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleCheckAuth = async () => {
        setLoadingAuth(true);
        try {
            const response = await checkAuth();
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

        handleCheckAuth();

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            await handleCheckAuth();
            navigate("/authenticate/login");
        } catch (error: unknown) {
            if (error instanceof InternalServerError) {
                console.error("Error during logout: ", error);
            } else {
                console.error("Unexpected error during logout: ", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, handleCheckAuth, loadingAuth, handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};