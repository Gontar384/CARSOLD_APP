import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";
import {api} from "../../../../../../../Config/AxiosConfig/AxiosConfig.ts";

interface InputFieldProps {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>;
    valueType: "name" | "phoneNumber" | "location";
}

const InputField: React.FC<InputFieldProps> = ({label, value, setValue, valueType}) => {

    const {isMobile} = useUtil();
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<"Edit" | "Save">("Edit");
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleEditButtonClick = () => {
        setInputActive(true);
        setButtonLabel("Save");
    }

    const handleSaveButtonClick = async () => {
        try {
            const response = await api.post(`api/contact-set-${valueType}`, {
                [valueType]: value
            });
            if (response.data) {
                setInputActive(false);
                setButtonLabel("Edit");
                setButtonActive(false);
            }
        } catch (error) {
            console.error("Error changing name: ", error);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setInputActive(false);
                setButtonActive(false);
                setButtonLabel("Edit");
            }
        };

        if (buttonActive && buttonLabel === "Edit") {
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, buttonActive]);  //adds event listener to deactivate button

    return (
        <div className="flex flex-col w-1/3">
            <p>{label}</p>
            <div className="flex flex-row relative cursor-pointer w-[100px] h-[20px] bg-lime"
            onMouseEnter={!isMobile && buttonLabel === "Edit" ? () => setButtonActive(true) : undefined}
            onMouseLeave={!isMobile && buttonLabel === "Edit" ? () => setButtonActive(false) : undefined}
            onTouchEnd={isMobile ? () => setButtonActive(true) : undefined}
            ref={componentRef}>
                <div className="w-full h-full">
                    {value}
                </div>
                <input className={`w-1/2 h-full absolute inset-0 ${inputActive ? "" : "hidden"}`}
                       type="text" value={value} onChange={(e) => setValue(e.target.value.trim())}/>
                <button className={`${buttonActive ? "" : "hidden"}`}
                onClick={buttonLabel === "Edit" ?  handleEditButtonClick : handleSaveButtonClick}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    )
}

export default InputField