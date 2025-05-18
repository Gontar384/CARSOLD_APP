import { Outlet } from "react-router-dom";
import React from "react";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import NavBar from "../../LayOut/NavBar/NavBar.tsx";

const OpenRoutes: React.FC = () => {
    const {loadingAuth} = useAuth();

    if (loadingAuth) return <NavBar/>
    return <Outlet />;
};

export default OpenRoutes;