import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import PrivateRoutes from "./Config/AuthConfig/PrivateRoutes.tsx";
import PublicRoutes from "./Config/AuthConfig/PublicRoutes.tsx";
import AuthErrorManager from "./Config/AuthConfig/AuthErrorManager.tsx";
import React from "react";
import {AuthProvider} from "./GlobalProviders/Auth/AuthProvider.tsx";
import {UtilProvider} from "./GlobalProviders/Util/UtilProvider.tsx";
import {SearchProvider} from "./GlobalProviders/Search/SearchProvider.tsx";
import AuthenticationPage from "./PageComponents/Authentication/Authentication.tsx";
import AccountActivation from "./PageComponents/AccountActivation/AccountActivation.tsx";
import TermsOfUse from "./PageComponents/TermsOfUse/TermsOfUse.tsx";
import PasswordRecovery from "./PageComponents/PasswordRecovery/PasswordRecovery.tsx";
import PasswordRecChange from "./PageComponents/PasswordRecoveryChange/PasswordRecChange.tsx";
import CookieBanner from "./Additional/Banners/CookieBanner.tsx";
import Search from "./PageComponents/Search/Search.tsx";
import AccountDetails from "./PageComponents/AccountDetails/AccountDetails.tsx";
import OfferForm from "./PageComponents/AddingOffer/OfferForm.tsx";
import OfferDisplay from "./PageComponents/OfferDisplay/OfferDisplay.tsx";
import OpenRoutes from "./Config/AuthConfig/OpenRoutes.tsx";
import Home from "./PageComponents/Home/Home.tsx";
import {MessagesProvider} from "./GlobalProviders/Messages/MessagesProvider.tsx";
import {UserUtilProvider} from "./GlobalProviders/UserUtil/UserUtilProvider.tsx";
import {LanguageProvider} from "./GlobalProviders/Language/LanguageProvider.tsx";

const App: React.FC = () => {

    return (
        <BrowserRouter> {/*manages routes*/}
            <LanguageProvider> {/*manages language*/}
                <UtilProvider> {/*provides util*/}
                    <AuthProvider> {/*manages authentication*/}
                        <SearchProvider> {/*provides search util*/}
                            <UserUtilProvider> {/*provides username and profilePic*/}
                                <MessagesProvider> {/*sending messages util*/}
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
                                            <Route path="/home" element={<Home/>}/>
                                        </Route>
                                        <Route element={<PrivateRoutes/>}>
                                            <Route path="/details/:section?" element={<AccountDetails/>}/>
                                            <Route path="/addingOffer" element={<OfferForm/>}/>
                                            <Route path="/modifyingOffer/:section?" element={<OfferForm/>}/>
                                        </Route>
                                        <Route path="*" element={<Navigate to="/home"/>}/>
                                    </Routes>
                                    <CookieBanner/> {/*displays cookie banner*/}
                                    <AuthErrorManager/> {/*monitors for token or verification error, displays 'session expired' banner*/}
                                </MessagesProvider>
                            </UserUtilProvider>
                        </SearchProvider>
                    </AuthProvider>
                </UtilProvider>
            </LanguageProvider>
        </BrowserRouter>
    )
};

export default App
