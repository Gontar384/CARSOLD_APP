import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import AuthErrorManager from "./Config/AuthConfig/AuthErrorManager.tsx";
import TokenManager from "./Config/TokensConfig/TokenManager.tsx";
import React from "react";
import {AuthProvider} from "./GlobalProviders/AuthProvider.tsx";
import {UtilProvider} from "./GlobalProviders/UtilProvider.tsx";
import {ItemsProvider} from "./GlobalProviders/ItemsProvider.tsx";
import AuthenticationPage from "./PageComponents/Authentication/Authentication.tsx";
import AccountActivation from "./PageComponents/AccountActivation/AccountActivation.tsx";
import TermsOfUse from "./PageComponents/TermsOfUse/TermsOfUse.tsx";
import PasswordRecovery from "./PageComponents/PasswordRecovery/PasswordRecovery.tsx";
import PasswordChange from "./PageComponents/PasswordChange/PasswordChange.tsx";
import CookieBanner from "./Additional/Banners/CookieBanner.tsx";
import Home from "./PageComponents/Home/Home.tsx";
import AccountDetails from "./PageComponents/AccountDetails/AccountDetails.tsx";
import TestUpload from "./Test/TestUpload.tsx";

const App: React.FC = () => {

    return (
        <UtilProvider> {/*provides util*/}
            <AuthProvider> {/*manages Auth state*/}
                <ItemsProvider> {/*provides items globally*/}
                    <BrowserRouter> {/*manages routes*/}
                        <Routes>
                            <Route element={<PublicRoutes/>}>
                                <Route path="/authenticate/:section?" element={<AuthenticationPage/>}/>
                                <Route path="/activate" element={<AccountActivation/>}/>
                                <Route path="/password-recovery" element={<PasswordRecovery/>}/>
                                <Route path="/very3secret8password4change" element={<PasswordChange/>}/>
                            </Route>

                            <Route path="/termsOfUse" element={<TermsOfUse/>}/>
                            <Route path="/home" element={<Home/>}/>

                            <Route element={<PrivateRoutes/>}>
                                <Route path="/details/:section?" element={<AccountDetails/>}/>
                            </Route>

                            <Route path="/test" element={<TestUpload/>}/>

                            <Route path="*" element={<Navigate to="/home"/>}/>
                        </Routes>
                        <TokenManager/> {/*manages tokens in the background*/}
                        <CookieBanner/> {/*displays cookie banner globally*/}
                        <AuthErrorManager/> {/*monitors for token or verification error, displays 'session expired' banner*/}
                    </BrowserRouter>
                </ItemsProvider>
            </AuthProvider>
        </UtilProvider>
    )
}

export default App
