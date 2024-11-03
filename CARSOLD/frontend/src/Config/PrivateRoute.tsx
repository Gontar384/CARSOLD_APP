import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "./AuthProvider.tsx";

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    // If loading, do not render anything
    if (isLoading) {
        return null; // or a loading spinner
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/authenticate" />;
};
export default PrivateRoute;

