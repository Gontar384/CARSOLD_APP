import React from "react";

import Logo from "./Atomic/Logo.tsx";
import SearchBar from "./Atomic/SearchBar.tsx";
import AddButton from "./Atomic/AddButton.tsx";
import UserDetails from "./Atomic/UserDetails/UserDetails.tsx";
import OptionsButton from "./Atomic/OptionsButton.tsx";
import LowerBar from "./Atomic/LowerBar/LowerBar.tsx";
import LoadingNavBarLine from "../../SharedComponents/Additional/Loading/LoadingNavBarLine.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";


const NavBar: React.FC = () => {

    const {isWide} = useUtil();
    const {loadingAuth} = useAuth();

    return (
        <>
            <div className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0 gap-2
            w-full h-10 m:h-11 shadow-bottom bg-lime z-50">
                {!isWide && <OptionsButton/>}
                <Logo/>
                <SearchBar/>
                {isWide &&
                    <>
                        <AddButton/>
                        <UserDetails/>
                    </>}
            </div>
            {!isWide && <LowerBar/>}
            {loadingAuth && <LoadingNavBarLine/>}
        </>
    )
}

export default NavBar