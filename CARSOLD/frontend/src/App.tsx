import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoute from "./RouterConfig/PrivateRoute.tsx";
import PublicRoute from "./RouterConfig/PublicRoute.tsx";
import {ReactElement} from "react";
import LoginRegister from "./LoginRegister/LoginRegister.tsx";
import AccountActivation from "./LoginRegister/AccountActivation.tsx";
import Home from "./Home/Home.tsx";

function App(): ReactElement {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute/>}>
                    </Route>

                <Route path="/authenticate" element={<LoginRegister/>}/>
                <Route path="/activate" element={<AccountActivation/>}/>


                <Route path="/home" element={<Home/>}/>

                <Route element={<PrivateRoute/>}>

                </Route>

                <Route path="*" element={<Navigate to="/home"/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
