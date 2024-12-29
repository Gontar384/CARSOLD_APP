import React, {useState} from "react";
import Decision from "./Atomic/Decision.tsx";
import DeleteConfirm from "./Atomic/DeleteConfirm.tsx";
import ExitButton from "./Atomic/Atomic/ExitButton.tsx";

interface PopupProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    googleLogged: boolean;
}

const Popup: React.FC<PopupProps> = ({setPopup, googleLogged}) => {

    const [confirmed, setConfirmed] = useState<boolean>(false);

    return (
        <div className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-40 z-50">
            <div className="w-full sm:w-[420px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px]
            3xl:w-[660px] h-36 xs:h-40 lg:h-48 xl:h-52 2xl:h-56 3xl:h-64 bg-lowLime text-base xs:text-lg
            lg:text-xl xl:text-[22px] 2xl:text-2xl 3xl:text-[26px] ring-4 lg:ring-[5px] xl:ring-[6px]
            2xl:ring-[7px] 3xl:ring-8 ring-lime rounded-sm relative">
                {!confirmed ? (
                    <Decision setConfirmed={setConfirmed} setPopup={setPopup}/>
                ) : (
                    !googleLogged ? (
                        <DeleteConfirm googleLogged={googleLogged} label="Please, provide your password:"/>
                    ) : (
                        <DeleteConfirm googleLogged={googleLogged} label="Type in 'delete_account' to confirm:"/>
                    ))}
                <ExitButton onClick={() => setPopup(false)}/>
            </div>
        </div>
    )
}

export default Popup