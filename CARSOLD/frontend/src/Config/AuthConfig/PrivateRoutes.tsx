import {Navigate, Outlet} from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import NavBar from "../../LayOut/NavBar/NavBar.tsx";

const PrivateRoutes: React.FC = () => {
    const { isAuthenticated, loadingAuth } = useAuth();

    if (loadingAuth) return <NavBar/>
    return isAuthenticated ? <Outlet /> : <Navigate to="/authenticate/login"/>;
};

export default PrivateRoutes;