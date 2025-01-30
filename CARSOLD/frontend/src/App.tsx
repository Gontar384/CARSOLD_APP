import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import AuthErrorManager from "./Config/AuthConfig/AuthErrorManager.tsx";
import React from "react";
import {AuthProvider} from "./GlobalProviders/Auth/AuthProvider.tsx";
import {UtilProvider} from "./GlobalProviders/Util/UtilProvider.tsx";
import {ItemsProvider} from "./GlobalProviders/Items/ItemsProvider.tsx";
import AuthenticationPage from "./PageComponents/Authentication/Authentication.tsx";
import AccountActivation from "./PageComponents/AccountActivation/AccountActivation.tsx";
import TermsOfUse from "./PageComponents/TermsOfUse/TermsOfUse.tsx";
import PasswordRecovery from "./PageComponents/PasswordRecovery/PasswordRecovery.tsx";
import PasswordRecChange from "./PageComponents/PasswordRecoveryChange/PasswordRecChange.tsx";
import CookieBanner from "./SharedComponents/Additional/Banners/CookieBanner.tsx";
import Home from "./PageComponents/Home/Home.tsx";
import AccountDetails from "./PageComponents/AccountDetails/AccountDetails.tsx";
import TokenManager from "./Config/TokensConfig/TokenManager.ts";

const App: React.FC = () => {

    return (
        <UtilProvider> {/*provides util*/}
            <AuthProvider> {/*manages authentication*/}
                <ItemsProvider> {/*provides items*/}
                    <BrowserRouter> {/*manages routes*/}
                        <Routes>
                            <Route element={<PublicRoutes/>}>
                                <Route path="/authenticate/:section?" element={<AuthenticationPage/>}/>
                                <Route path="/activate" element={<AccountActivation/>}/>
                                <Route path="/password-recovery" element={<PasswordRecovery/>}/>
                                <Route path="/very3secret8password4change" element={<PasswordRecChange/>}/>
                            </Route>

                            <Route path="/termsOfUse" element={<TermsOfUse/>}/>
                            <Route path="/home" element={<Home/>}/>

                            <Route element={<PrivateRoutes/>}>
                                <Route path="/details/:section?" element={<AccountDetails/>}/>
                            </Route>

                            <Route path="*" element={<Navigate to="/home"/>}/>
                        </Routes>
                        <TokenManager/> {/*manages tokens*/}
                        <CookieBanner/> {/*displays cookie banner*/}
                        <AuthErrorManager/> {/*monitors for token or verification error, displays 'session expired' banner*/}
                    </BrowserRouter>
                </ItemsProvider>
            </AuthProvider>
        </UtilProvider>
    )
}

export default App
