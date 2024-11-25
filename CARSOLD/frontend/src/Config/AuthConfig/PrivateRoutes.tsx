import {Navigate, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";

//checks if user is authenticated and redirects if needed
const PrivateRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/authenticate"/>;
};

export default PrivateRoutes;

