import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";
import React from "react";

//checks if user is authenticated and redirects if needed
const PublicRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/myAccount"/> : <Outlet />;
};

export default PublicRoutes;