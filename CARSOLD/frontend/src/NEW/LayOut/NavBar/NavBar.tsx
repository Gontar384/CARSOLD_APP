import React from "react";
import {useUtil} from "../../../GlobalProviders/UtilProvider.tsx";
import Logo from "./Atomic/Logo.tsx";
import SearchBar from "./Atomic/SearchBar.tsx";
import AddButton from "./Atomic/AddButton.tsx";
import UserDetails from "./Atomic/UserDetails/UserDetails.tsx";
import LowerBar from "./Atomic/LowerBar/LowerBar.tsx";
import OptionsButton from "./Atomic/OptionsButton.tsx";
import {useAuth} from "../../../GlobalProviders/AuthProvider.tsx";
import LoadingAuthScreen from "../../../LoadingScreens/LoadingAuthScreen.tsx";

const NavBar: React.FC = () => {

    const { isWide } = useUtil();
    const { loadingAuth } = useAuth();

    return (
        <>
            {isWide ? (
                <div className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0
                     w-full h-9 lg:h-10 xl:h-12 2xl:h-[52px] 3xl:h-14 shadow-bottom bg-lime z-50">
                    <Logo/>
                    <SearchBar/>
                    <AddButton/>
                    <UserDetails/>
                </div>
            ) : (
                <>
                    <div className="flex flex-row items-center justify-evenly h-7 xs:h-8 fixed left-0 top-0 right-0 bg-lime shadow-bottom z-50">
                        <OptionsButton/>
                        <Logo/>
                        <SearchBar/>
                    </div>
                    <LowerBar/>
                </>
            )}
            {loadingAuth && <LoadingAuthScreen/>}
        </>
    )
}

export default NavBar