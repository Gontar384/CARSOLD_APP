import {Navigate, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import NavBar from "../../LayOut/NavBar/NavBar.tsx";

const PublicRoutes: React.FC = () => {
    const { isAuthenticated, loadingAuth } = useAuth();

    if (loadingAuth) return <NavBar/>
    return isAuthenticated ? <Navigate to="/details/myOffers"/> : <Outlet />;
};

export default PublicRoutes;