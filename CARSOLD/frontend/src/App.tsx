import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import {ReactElement} from "react";
import LoginRegister from "./LoginRegister/LoginRegister.tsx";
import AccountActivation from "./LoginRegister/AccountActivation.tsx";
import Home from "./Home/Home.tsx";
import {AuthProvider} from "./Config/AuthConfig/AuthProvider.tsx";
import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "./Config/TokenConfig/TokenManagement.tsx";
import LoadingManager from "./Config/LoadingConfig/LoadingManager.tsx";
import {LoadingProvider} from "./Config/LoadingConfig/LoadingProvider.tsx";
import CookieBanner from "./CookieBanner/CookieBanner.tsx";
import {CookieBannerProvider} from "./CookieBanner/CookieBannerProvider.tsx";

function App(): ReactElement {

    return (
        <LoadingProvider> {/*wraps all components, providing loading screen*/}
            <CookieBannerProvider>
                <AuthProvider> {/*wraps all components with authentication mechanisms*/}
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
                        <CookieBanner/> {/*displays cookie banner if csrf is fetched*/}
                    </BrowserRouter>
                </AuthProvider>
            </CookieBannerProvider>
        </LoadingProvider>
    )

    //manages csrf fetch, jwt refreshing and monitors user activity
    function TokenManager() {
        useFetchCsrf();
        useRefreshJwt();
        useTrackUserActivity();
        return null;
    }
}

export default App
