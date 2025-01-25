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
            <div className="w-10/12 max-w-[600px] text-xl m:text-2xl bg-lowLime ring-[5px] m:ring-[6px]
            ring-lime rounded-sm relative">
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