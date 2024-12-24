import React from "react";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

const DeleteAccountButton: React.FC = () => {

    const {isWide} = useUtil();

    return (
        <div className={`flex flex-col-reverse w-full h-full 
        ${isWide ? "items-center pb-3 lg:pb-5 xl:pb-6 2xl:pb-7 3xl:pb-8 sm:pr-2 lg:pr-0" : "items-end pr-4 xs:pr-5"}`}>
            <button className="flex justify-center items-center w-[60px] xs:w-[70px] lg:w-[85px] xl:w-[95px]
            2xl:w-[115px] 3xl:w-[120px] h-[30px] xs:h-[35px] lg:h-[45px] xl:h-[53px] 2xl:h-[62px] 3xl:h-[66px]
            text-[10px] xs:text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:test-xl bg-coolRed text-white
            rounded-full">
                Delete Account
            </button>
        </div>
    )
}

export default DeleteAccountButton