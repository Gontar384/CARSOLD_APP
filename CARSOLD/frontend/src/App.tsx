import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import {ReactElement} from "react";
import LoginRegister from "./LoginRegister/LoginRegister.tsx";
import AccountActivation from "./LoginRegister/AccountActivation.tsx";
import Home from "./Home/Home.tsx";
import {AuthProvider} from "./Config/AuthConfig/AuthProvider.tsx";
import LoadingManager from "./Config/LoadingConfig/LoadingManager.tsx";
import {LoadingProvider} from "./Config/LoadingConfig/LoadingProvider.tsx";
import CookieBanner from "./Banners/CookieBanner.tsx";
import AuthErrorManager from "./Config/AuthConfig/AuthErrorManager.tsx";
import TokenManager from "./Config/TokenConfig/TokenManager.tsx";

function App(): ReactElement {

    return (
        <LoadingProvider> {/*wraps all components, monitors loading state*/}
            <AuthProvider> {/*wraps all components, monitors auth state*/}
                <BrowserRouter> {/*manages routes*/}
                    <Routes>
                        <Route element={<PublicRoutes/>}>
                            <Route path="/authenticate" element={<LoginRegister/>}/>
                            <Route path="/activate" element={<AccountActivation/>}/>
                        </Route>
                        <Route element={<PrivateRoutes/>}>

                        </Route>

                        <Route path="/home" element={<Home/>}/>

                        <Route path="*" element={<Navigate to="/home"/>}/>
                    </Routes>
                    <TokenManager/> {/*manages tokens in the background*/}
                    <LoadingManager/> {/*displays loading screen globally*/}
                    <CookieBanner/> {/*displays cookie banner globally*/}
                    <AuthErrorManager/> {/*monitors for any token or verification error, displays 'session expired' banner*/}
                </BrowserRouter>
            </AuthProvider>
        </LoadingProvider>
    )

}

export default App
