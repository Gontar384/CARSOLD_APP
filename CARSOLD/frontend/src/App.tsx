import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import Authentication from "./UserManagement/AuthenticationPage/Authentication.tsx";
import AccountActivation from "./UserManagement/AccountActivation.tsx";
import Home from "./Home/Home.tsx";
import {AuthProvider} from "./Config/AuthConfig/AuthProvider.tsx";
import CookieBanner from "./Banners/CookieBanner.tsx";
import AuthErrorManager from "./Config/AuthConfig/AuthErrorManager.tsx";
import TokenManager from "./Config/TokenConfig/TokenManager.tsx";
import {DarkModeProvider} from "./Config/DarkMode/DarkModeProvider.tsx";
import PasswordRecovery from "./UserManagement/PasswordRecovery.tsx";
import PasswordRecoveryChange from "./UserManagement/PasswordRecoveryChange.tsx";
import TermsOfUse from "./UserManagement/TermsOfUse.tsx";
import AccountDetails from "./UserManagement/AccountDetails/AccountDetails.tsx";
import {ReactElement} from "react";

function App(): ReactElement {

    return (
        <DarkModeProvider> {/*wraps components, monitors and change Mode state*/}
                <AuthProvider> {/*wraps components, monitors Auth state*/}
                    <BrowserRouter> {/*manages routes*/}
                        <Routes>
                            <Route element={<PublicRoutes/>}>
                                <Route path="/authenticate" element={<Authentication/>}/>
                                <Route path="/activate" element={<AccountActivation/>}/>
                                <Route path="/password-recovery" element={<PasswordRecovery/>}/>
                                <Route path="/very3secret8password4change" element={<PasswordRecoveryChange/>}/>
                            </Route>

                            <Route element={<PrivateRoutes/>}>
                                <Route path="/myAccount" element={<AccountDetails/>}/>
                            </Route>

                            <Route path="/termsOfUse" element={<TermsOfUse/>}/>
                            <Route path="/home" element={<Home/>}/>

                            <Route path="*" element={<Navigate to="/home"/>}/>
                        </Routes>
                        <TokenManager/> {/*manages tokens in the background*/}
                        <CookieBanner/> {/*displays cookie banner globally*/}
                        <AuthErrorManager/> {/*monitors for token or verification error, displays 'session expired' banner*/}
                    </BrowserRouter>
                </AuthProvider>
        </DarkModeProvider>
    )

}

export default App
