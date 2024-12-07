import React, {useEffect} from "react";
import {useUserDetails} from "../../../../LayOut/CustomHooks/UseUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/AuthProvider.tsx";

const Username: React.FC = () => {

    const {isAuthenticated} = useAuth();
    const {userDetails, usernameFetched, handleUsernameFetch} = useUserDetails();

    useEffect(() => {
        handleUsernameFetch().then();
    }, [isAuthenticated]);  //fetches username

    return (
        <div className="text-3xl">
            {userDetails}
        </div>
    )
}

export default Username