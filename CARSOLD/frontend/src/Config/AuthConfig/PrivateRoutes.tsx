import {Navigate, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";

//redirects
const PrivateRoutes: React.FC = () => {
    const { isAuthenticated, loadingAuth } = useAuth();

    if (loadingAuth) {
        return null;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/authenticate"/>;
};

export default PrivateRoutes;

