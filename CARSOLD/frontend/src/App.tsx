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
import CookieBanner from "./Additional/Banners/CookieBanner.tsx";
import Search from "./PageComponents/Search/Search.tsx";
import AccountDetails from "./PageComponents/AccountDetails/AccountDetails.tsx";
import TokensManager from "./Config/TokensConfig/TokensManager.ts";
import OfferForm from "./PageComponents/AddingOffer/OfferForm.tsx";
import OfferDisplay from "./PageComponents/OfferDisplay/OfferDisplay.tsx";
import OpenRoutes from "./Config/AuthConfig/OpenRoutes.tsx";
import GoogleMapsWrapper
    from "./PageComponents/OfferDisplay/SmallContainer/UserInformation/Atomic/GoogleMapsWrapper.tsx";

const App: React.FC = () => {

    return (
        <BrowserRouter> {/*manages routes*/}
            <UtilProvider> {/*provides util*/}
                <AuthProvider> {/*manages authentication*/}
                    <ItemsProvider> {/*provides items*/}
                        <GoogleMapsWrapper>
                            <Routes>
                                <Route element={<PublicRoutes/>}>
                                    <Route path="/authenticate/:section?" element={<AuthenticationPage/>}/>
                                    <Route path="/activate" element={<AccountActivation/>}/>
                                    <Route path="/password-recovery" element={<PasswordRecovery/>}/>
                                    <Route path="/very3secret8password4change" element={<PasswordRecChange/>}/>
                                </Route>

                                <Route element={<OpenRoutes/>}>
                                    <Route path="/termsOfUse" element={<TermsOfUse/>}/>
                                    <Route path="/search" element={<Search/>}/>
                                    <Route path="/displayOffer/:section?" element={<OfferDisplay/>}/>
                                </Route>

                                <Route element={<PrivateRoutes/>}>
                                    <Route path="/details/:section?" element={<AccountDetails/>}/>
                                    <Route path="/addingOffer" element={<OfferForm/>}/>
                                    <Route path="/modifyingOffer/:section?" element={<OfferForm/>}/>
                                </Route>

                                <Route path="*" element={<Navigate to="/search"/>}/>
                            </Routes>
                        </GoogleMapsWrapper>
                        <TokensManager/> {/*manages tokens*/}
                        <CookieBanner/> {/*displays cookie banner*/}
                        <AuthErrorManager/> {/*monitors for token or verification error, displays 'session expired' banner*/}
                    </ItemsProvider>
                </AuthProvider>
            </UtilProvider>
        </BrowserRouter>
    )
};

export default App
