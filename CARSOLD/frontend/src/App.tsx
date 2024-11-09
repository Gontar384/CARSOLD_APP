import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./Config/PrivateRoute.tsx";
import PublicRoute from "./Config/PublicRoute.tsx";
import {ReactElement} from "react";
import LoginRegister from "./LoginRegister/LoginRegister.tsx";
import AccountActivation from "./LoginRegister/AccountActivation.tsx";
import Home from "./Home/Home.tsx";
import {AuthProvider} from "./Config/AuthProvider.tsx";
import {useTrackUserActivity} from "./Config/AxiosConfig.tsx";

function App(): ReactElement {

    useTrackUserActivity();

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
