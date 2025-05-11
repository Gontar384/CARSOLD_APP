import React, {useEffect, useState} from 'react';
import {AuthContext} from './useAuth.ts';
import {InternalServerError} from "../../ApiCalls/Errors/CustomErrors.ts";
import {checkAuth, fetchJwt, logout} from "../../ApiCalls/Services/UserService.ts";
import {useNavigate} from "react-router-dom";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
    const navigate = useNavigate();
    const [preventFetch, setPreventFetch] = useState<boolean>(false);

    const handleCheckAuth = async () => {
        setLoadingAuth(true);
        try {
            const response = await checkAuth();
            const authState = response.status === 200;
            localStorage.setItem('Authenticated', authState ? 'true' : 'false');
            setIsAuthenticated(authState);
        } catch (error) {
            console.error("Error checking authentication: ", error);
            localStorage.setItem('Authenticated', 'false');
            setIsAuthenticated(false);
        } finally {
            setLoadingAuth(false);
        }
    };

    //checks Auth on initial and listens for Auth change on different Tabs (localStorage)
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

    //fetches JWT on initial and refreshes every 5 minutes
    useEffect(() => {
        const handleFetchJwt = async () => {
            if (isAuthenticated) {
                try {
                    await fetchJwt();
                } catch (error) {
                    console.error("Error refreshing JWT token: ", error);
                }
            }
        };

        let interval = null;
        if (isAuthenticated) {
            handleFetchJwt();
            interval = setInterval(handleFetchJwt, 5 * 60 * 1000);
        }

        return () => {
            if (interval) clearInterval(interval)
        };
    }, [isAuthenticated]);

    const handleLogout = async () => {
        try {
            setPreventFetch(true);
            await logout();
            await handleCheckAuth();
        } catch (error: unknown) {
            if (error instanceof InternalServerError) {
                console.error("Error during logout: ", error);
            } else {
                console.error("Unexpected error during logout: ", error);
            }
        } finally {
            setTimeout(() => {
                navigate("/authenticate/login");
                setPreventFetch(false);
            }, 10);
        }
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, handleCheckAuth, loadingAuth, handleLogout, preventFetch}}>
            {children}
        </AuthContext.Provider>
    );
};