import {Navigate, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";

const PublicRoutes: React.FC = () => {
    const { isAuthenticated, loadingAuth } = useAuth();

    if (loadingAuth) return null;

    return isAuthenticated ? <Navigate to="/details/myOffers"/> : <Outlet />;
};

export default PublicRoutes;