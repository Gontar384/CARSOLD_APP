import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import CookieBanner from "./Banners/CookieBanner.tsx";
import AuthErrorManager from "./Config/AuthConfig/AuthErrorManager.tsx";
import TokenManager from "./Config/TokensConfig/TokenManager.tsx";
import {ReactElement} from "react";
import {AuthProvider} from "./GlobalProviders/AuthProvider.tsx";
import Authentication from "./PageComponents/Authentication/Authentication.tsx";
import AccountActivation from "./PageComponents/Authentication/AccountActivation.tsx";
import Home from "./PageComponents/Home/Home.tsx";
import {UtilProvider} from "./GlobalProviders/UtilProvider.tsx";
import PasswordRecovery from "./PageComponents/Authentication/PasswordRecovery.tsx";
import PasswordRecoveryChange from "./PageComponents/Authentication/PasswordRecoveryChange.tsx";
import TermsOfUse from "./PageComponents/Authentication/TermsOfUse.tsx";
import AccountDetails from "./PageComponents/AccountDetails/AccountDetails.tsx";
import {ItemsProvider} from "./GlobalProviders/ItemsProvider.tsx";
import LoadingAuthScreen from "./LoadingScreens/LoadingAuthScreen.tsx";

function App(): ReactElement {

    return (
        <UtilProvider> {/*wraps components, provides util*/}
            <AuthProvider> {/*wraps components and monitors Auth state*/}
                <ItemsProvider> {/*wraps components, provides items globally*/}
                    <BrowserRouter> {/*manages routes*/}
                        <Routes>
                            <Route element={<PublicRoutes/>}>
                                <Route path="/authenticate/:section?" element={<Authentication/>}/>
                                <Route path="/activate" element={<AccountActivation/>}/>
                                <Route path="/password-recovery" element={<PasswordRecovery/>}/>
                                <Route path="/very3secret8password4change" element={<PasswordRecoveryChange/>}/>
                            </Route>

                            <Route element={<PrivateRoutes/>}>
                                <Route path="/myAccount/:section?" element={<AccountDetails/>}/>
                            </Route>

                            <Route path="/test" element={<LoadingAuthScreen/>}/>
                            <Route path="/termsOfUse" element={<TermsOfUse/>}/>
                            <Route path="/home" element={<Home/>}/>

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
