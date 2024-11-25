import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";
import React from "react";

//checks if user is authenticated and redirects if needed
const PrivateRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Outlet /> : <Navigate to="/authenticate"/>;
};

export default PrivateRoutes;

