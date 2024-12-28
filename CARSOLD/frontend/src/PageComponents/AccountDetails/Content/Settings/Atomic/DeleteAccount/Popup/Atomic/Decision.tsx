import React from "react";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";

interface DecisionProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Decision: React.FC<DecisionProps> = ({setPopup, setConfirmed}) => {

    return (
        <div className="flex flex-col w-full h-full">
            <p className="text-center mt-5 xs:mt-6 lg:mt-8 xl:mt-9 2xl:mt-10 3xl:mt-14">
                Are you sure you want to delete your account?</p>
            <div className="flex flex-row items-center justify-center mt-9 xs:mt-10
                    lg:mt-12 xl:mt-[52px] 3xl:mt-[60px] gap-9 xs:gap-10 lg:gap-12 xl:gap-[52px] 2xl:gap-14 3xl:gap-16">
                <ConfirmButton label="Yes" type="choice" onClick={() => setConfirmed(true)}/>
                <ConfirmButton label="No" type="choice" onClick={() => setPopup(false)}/>
            </div>
        </div>
    )
}

export default Decision