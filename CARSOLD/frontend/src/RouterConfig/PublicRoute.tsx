import {Outlet, Navigate} from 'react-router-dom';
import {ReactElement} from "react";

//will hold all routes which are available with no authentication
//they'll be not available when user is authenticated
const isAuthenticated = (): boolean => {
    const token: string | null = localStorage.getItem('token');
    return token !== null;
};

const PublicRoute = (): ReactElement => {
    return isAuthenticated() ? <Navigate to="/home"/> : <Outlet/>;
}

export default PublicRoute;