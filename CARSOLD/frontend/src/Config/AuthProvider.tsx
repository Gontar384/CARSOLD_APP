import React, { createContext, useContext, useEffect, useState } from 'react';
import {api} from "./AxiosConfig.tsx";

//defines structure of authentication context
interface AuthContextType {
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
    isLoading: boolean;             //adds loading state
}

//creates authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//creates authentication function-component which is then used in 'App' and wraps other components
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);   //monitors if user is authenticated
    const [isLoading, setIsLoading] = useState<boolean>(true);      //indicates ongoing authentication check
                                                                    //lets use loading appearance

    //function to check authentication, used in multiple components
    const checkAuth = async () => {
        setIsLoading(true);     //starts loading before auth
        try {
            const response = await api.get(`api/auth/check-authentication`);
            const authState = response.data['isAuth'];
            localStorage.setItem('Authenticated', authState ? 'true' : 'false');    //sets if user is auth to work in other tabs
            setIsAuthenticated(authState);               //sets auth state
        } catch (error) {
            console.error("Error checking authentication: ", error);
        }finally {
            setIsLoading(false);    //ends loading after auth
        }
    };

    //listens to localstorage and then update auth state
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent)=> {
            if (event.key === 'Authenticated') {
                const newAuthState: boolean = event.newValue === 'true';
                setIsAuthenticated(newAuthState);
            }
        };

        //monitors localstorage change
        window.addEventListener('storage', handleStorageChange);

        //cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    //initials authentication check on component mount
    useEffect(() => {
        checkAuth();
    }, []);

    //makes values accessible for all AuthContext children
    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

//custom hook to access AuthContext
export const useAuth= () => {
    const context: AuthContextType | undefined = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
