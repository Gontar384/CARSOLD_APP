import React, {useState} from "react";
import Decision from "./Atomic/Decision.tsx";
import DeleteConfirm from "./Atomic/DeleteConfirm.tsx";
import ExitButton from "./Atomic/Atomic/ExitButton.tsx";
import {useLanguage} from "../../../../../../../GlobalProviders/Language/useLanguage.ts";

interface PopupProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    googleLogged: boolean;
    setWentWrong: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<PopupProps> = ({setPopup, googleLogged, setWentWrong}) => {
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const {t} = useLanguage();

    return (
        <div className="flex items-center justify-center fixed inset-0 bg-black bg-opacity-40 z-50">
            <div className="w-10/12 max-w-[600px] text-xl m:text-2xl bg-lowLime ring-[5px] m:ring-[6px]
            ring-lime rounded-sm relative">
                {!confirmed ? (
                    <Decision setConfirmed={setConfirmed} setPopup={setPopup}/>
                ) : (
                    !googleLogged ? (
                        <DeleteConfirm googleLogged={googleLogged} label={t("deleteAccount5")}
                                       setPopup={setPopup} setWentWrong={setWentWrong}/>
                    ) : (
                        <DeleteConfirm googleLogged={googleLogged} label={t("deleteAccount6")}
                                       setPopup={setPopup} setWentWrong={setWentWrong}/>
                    ))}
                <ExitButton onClick={() => setPopup(false)}/>
            </div>
        </div>
    )
}

export default Popup