import React, {useEffect} from "react";
import {useUserDetails} from "../../../../LayOut/CustomHooks/UseUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/AuthProvider.tsx";
import UsernameLoader from "../../../../Additional/Loading/UsernameLoader.tsx";

const Username: React.FC = () => {

    const {isAuthenticated} = useAuth();
    const {userDetails, usernameFetched, handleUsernameFetch} = useUserDetails();

    useEffect(() => {
        handleUsernameFetch().then();
    }, [isAuthenticated]);  //fetches username

    return (
        <div className="flex justify-center text-xl xs:text-2xl lg:text-[28px] xl:text-[32px] 2xl:text-4xl 3xl:text-[40px]
        text-white font-bold w-full text-center ml-12 xs:ml-14 sm:ml-8 lg:ml-7 xl:ml-6 2xl:ml-8">
            {usernameFetched ? userDetails :
            <UsernameLoader/>}
        </div>
    )
}

export default Username