import { Outlet } from "react-router-dom";
import React from "react";
import { useAuth } from "../../GlobalProviders/Auth/useAuth";

const OpenRoutes: React.FC = () => {
    const { loadingAuth } = useAuth();

    if (loadingAuth) return null;

    return <Outlet />;
};

export default OpenRoutes;