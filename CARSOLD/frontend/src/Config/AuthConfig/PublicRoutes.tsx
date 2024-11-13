import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";
import React from "react";
import {useLoading} from "../LoadingConfig/LoadingProvider.tsx";

//checks if user is authenticated and redirects if needed
const PublicRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { isAppLoading } = useLoading(); // Use global loading state

    //prevent PublicRoute from displaying 'default route' when Auth state is not known yet
    if (isAppLoading) {
        return null;
    }

    return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoutes;