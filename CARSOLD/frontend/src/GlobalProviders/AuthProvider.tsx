import React, {createContext, useContext, useEffect, useState} from 'react';
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";
import LoadingAuthScreen from "../LoadingScreens/LoadingAuthScreen.tsx";

//provides authentication state globally

//defines structure
interface AuthContextType {
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
}

//creates authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//creates provider-component which is then used in 'App' and wraps other components
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);   //monitors if user is authenticated
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true); //tracks authentication check status

    //function to check authentication, used in multiple components
    const checkAuth = async () => {
        setLoadingAuth(true);
        try {
            const response = await api.get(`api/auth/check-authentication`);
            const authState = response.data['isAuth'];
            localStorage.setItem('Authenticated', authState ? 'true' : 'false');    //sets if user is auth to work in other tabs
            setIsAuthenticated(authState);               //sets auth state
        } catch (error) {
            console.error("Error checking authentication: ", error);
            setIsAuthenticated(false);
        } finally {
            setLoadingAuth(false);   //marks check as complete
        }
    };

    //'listens' to localstorage and then update auth state
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
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

    //makes values accessible for all AuthProvider children
    return (
        <AuthContext.Provider value={{isAuthenticated, checkAuth}}>
            {loadingAuth ? <LoadingAuthScreen/> : children} {/*renders children only after authentication check */}
        </AuthContext.Provider>
    );
};

//custom hook to use context
export const useAuth = (): AuthContextType => {
    const context: AuthContextType | undefined = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
