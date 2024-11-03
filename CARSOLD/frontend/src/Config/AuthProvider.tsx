import React, { createContext, useContext, useEffect, useState } from 'react';
import api from "./AxiosConfig.tsx";

interface AuthContextType {
    isAuthenticated: boolean;
    checkAuth: () => Promise<void>;
    isLoading: boolean; // Add loading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Initialize loading state

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/check-authentication`);
            const authState = response.data['isAuth'];
            localStorage.setItem('Authenticated', authState ? 'true' : 'false');
            setIsAuthenticated(authState);
        } catch (error) {
            console.error("Error checking authentication: ", error);
        }finally {
            setIsLoading(false); // Update loading state once the check is done
        }
    };

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'Authenticated') {
                const newAuthState = event.newValue === 'true';
                setIsAuthenticated(newAuthState);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Initial authentication check on component mount
    useEffect(() => {
        checkAuth();
    }, []);
    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
