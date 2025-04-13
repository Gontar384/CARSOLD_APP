import React from "react";
import UsernameLoader from "../../../../Additional/Loading/UsernameLoader.tsx";
import {useUserUtil} from "../../../../GlobalProviders/UserUtil/useUserUtil.ts";

const Username: React.FC = () => {
    const {username, usernameFetched} = useUserUtil();

    return (
        <div className="flex justify-center text-2xl m:text-[28px] text-white font-bold w-full text-center ml-[65px] m:ml-[50px]">
            {usernameFetched ? username : <UsernameLoader/>}
        </div>
    )
}

export default Username