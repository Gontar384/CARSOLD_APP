import React, {useEffect} from "react";
import {useUserDetails} from "../../../../CustomHooks/useUserDetails.ts";
import UsernameLoader from "../../../../SharedComponents/Additional/Loading/UsernameLoader.tsx";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";

const Username: React.FC = () => {

    const {isAuthenticated} = useAuth();
    const {userDetails, usernameFetched, handleUsernameFetch} = useUserDetails();

    useEffect(() => {
        handleUsernameFetch().then();
    }, [handleUsernameFetch, isAuthenticated]);  //fetches username

    return (
        <div className="flex justify-center text-2xl m:text-[28px] text-white font-bold w-full text-center ml-[75px] m:ml-[50px]">
            {usernameFetched ? userDetails :
            <UsernameLoader/>}
        </div>
    )
}

export default Username