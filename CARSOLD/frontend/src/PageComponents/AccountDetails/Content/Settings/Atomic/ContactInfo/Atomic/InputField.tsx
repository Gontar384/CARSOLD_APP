import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";
import {api} from "../../../../../../../Config/AxiosConfig/AxiosConfig.ts";

interface InputFieldProps {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>;
    valueType: "name" | "phone" | "city";
    setFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputField: React.FC<InputFieldProps> = ({label, value, setValue, valueType, setFetch}) => {

    const {isMobile} = useUtil();
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<"Edit" | "Save">("Edit");
    const componentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
        if (inputActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputActive]);   //sets cursor inside input

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setInputActive(false);
                setButtonActive(false);
                setButtonLabel("Edit");
                setFetch(prev => !prev);
            }
        };

        if (buttonActive) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, buttonActive]);  //adds event listener to deactivate button

    return (
        <div className="flex flex-col lg:gap-[1px] 2xl:gap-[2px]">
            <label className="text-xs xs:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:test-2xl">
                {label}
            </label>
            <div className="flex flex-row w-fit text-sm xs:text-base lg:text-lg xl:text-xl 2xl:text-2xl
            3xl:test-3xl cursor-pointer"
                 onMouseEnter={!isMobile && buttonLabel === "Edit" ? () => setButtonActive(true) : undefined}
                 onMouseLeave={!isMobile && buttonLabel === "Edit" ? () => setButtonActive(false) : undefined}
                 onTouchEnd={isMobile ? () => setButtonActive(true) : undefined}
                 ref={componentRef}>
                <div className="w-[150px] xs:w-[180px] sm:w-[140px] lg:w-[180px] xl:w-[200px] 2xl:w-[240px]
                3xl:w-[270px] h-[21px] xs:h-[25px] lg:h-[29px] xl:h-[33px] 2xl:h-9 3xl:h-[38px] relative mr-5">
                    <div className={`flex items-center w-full h-full px-[2px] xs:px-[3px] lg:px-[4px] xl:px-[5px]
                    2xl:px-[6px] 3xl:px-[7px] rounded-sm overflow-hidden 
                    ${!inputActive ? "border border-black border-opacity-30" : ""}`}>
                        {value}
                    </div>
                    {inputActive &&
                        <input className={`absolute inset-0 focus:outline-none rounded-sm px-[2px] xs:px-[3px]
                        lg:px-[4px] xl:px-[5px] 2xl:px-[6px] 3xl:px-[7px]`}
                               ref={inputRef}
                               type="text" value={value}
                               onChange={(e) => setValue(e.target.value.trim())}/>}
                </div>
                {buttonActive &&
                    <button className={`w-10 xs:w-11 lg:w-[50px] xl:w-14 2xl:w-16 3xl:w-[70px] h-[21px] xs:h-[25px]
                    lg:h-[29px] xl:h-[33px] 2xl:h-9 3xl:h-[38px] border border-black bg-lime rounded-sm`}
                            onClick={buttonLabel === "Edit" ? handleEditButtonClick : handleSaveButtonClick}>
                        {buttonLabel}
                    </button>
                }
            </div>
        </div>
    )
}

export default InputField