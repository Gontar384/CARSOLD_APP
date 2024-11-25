import {Navigate, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";

//checks if user is authenticated and redirects if needed
const PublicRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/myAccount"/> : <Outlet />;
};

export default PublicRoutes;