import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./Config/PrivateRoute.tsx";
import PublicRoute from "./Config/PublicRoute.tsx";
import {ReactElement, useEffect} from "react";
import LoginRegister from "./LoginRegister/LoginRegister.tsx";
import AccountActivation from "./LoginRegister/AccountActivation.tsx";
import Home from "./Home/Home.tsx";
import axios from "axios";
import {AuthProvider} from "./Config/AuthProvider.tsx";

function App(): ReactElement {

    const fetchCsrf = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/csrf`, {
                withCredentials: true,
            })
        } catch (error) {
            console.log("Error fetching csrf: ", error)
        }
    }
    useEffect(() => {
        fetchCsrf();
    }, [])

    return (
        <AuthProvider>
        <BrowserRouter>
                <Routes>
                    <Route element={<PublicRoute/>}>
                        <Route path="/authenticate" element={<LoginRegister/>}/>
                        <Route path="/activate" element={<AccountActivation/>}/>
                    </Route>

                    <Route element={<PrivateRoute/>}>
                        <Route path="/home" element={<Home/>}/>
                    </Route>

                    <Route path="*" element={<Navigate to="/home"/>}/>
                </Routes>
        </BrowserRouter>
        </AuthProvider>

    )
}

export default App
