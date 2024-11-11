import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";

//checks if user is authenticated and redirects if needed
const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    //if auth is loading, can show some loading appearance
    if (isLoading) {
        return null;
    }
    return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoute;