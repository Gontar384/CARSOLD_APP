import Logo from "./Logo.tsx";
import Searching from "./Searching.tsx";
import UserDetails from "./UserDetails.tsx";
import AddButton from "./AddButton.tsx";
import {ReactElement} from "react";

function NavBar(): ReactElement {

    return (
        <div className="flex flex-col sm:flex-row-reverse lg:flex-row items-center justify-evenly
         w-full sm:h-20 gap-4 p-1 sm:fixed font-sans border-b-2 border-black bg-lime z-50">
            <div className="flex flex-row items-center justify-between sm:justify-start
             w-full sm:w-auto sm3:px-2 sm2:px-6 sm1:px-8 sm:p-0 gap-10 lg:gap-10 ">
                <Logo/>
                <UserDetails/>
            </div>
            <div className="flex flex-row items-center justify-between sm:justify-start
             w-full sm:w-auto sm3:px-2 sm2:px-6 sm1:px-8 sm:p-0 gap-8 md:gap-10">
                <Searching/>
                <AddButton/>
            </div>
        </div>
    )
}

export default NavBar