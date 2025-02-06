import React, {useEffect} from "react";
import {useUserUtil} from "../../../../CustomHooks/useUserUtil.ts";
import UsernameLoader from "../../../../SharedComponents/Additional/Loading/UsernameLoader.tsx";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";

const Username: React.FC = () => {

    const {isAuthenticated} = useAuth();
    const {username, usernameFetched, handleFetchUsername} = useUserUtil();

    useEffect(() => {
        handleFetchUsername();
    }, [handleFetchUsername, isAuthenticated]);  //fetches username

    return (
        <div className="flex justify-center text-2xl m:text-[28px] text-white font-bold w-full text-center ml-[65px] m:ml-[50px]">
            {usernameFetched ? username : <UsernameLoader/>}
        </div>
    )
}

export default Username