import {Outlet, Navigate} from 'react-router-dom';
import {ReactElement} from "react";

//will hold all routes which are available after authentication
const isAuthenticated = (): boolean => {
    const token: string | null = localStorage.getItem('token');
    return token !== null;
};

const PrivateRoute = (): ReactElement => {
    return isAuthenticated() ? <Outlet/> : <Navigate to="/authenticate"/>;
};

export default PrivateRoute;