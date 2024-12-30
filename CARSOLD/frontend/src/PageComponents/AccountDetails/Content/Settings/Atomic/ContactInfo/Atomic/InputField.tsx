import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";
import {api} from "../../../../../../../Config/AxiosConfig/AxiosConfig.ts";
import ContactInputLoader from "../../../../../../../SharedComponents/Additional/Loading/ContactInputLoader.tsx";

interface InputFieldProps {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>;
    valueType: "name" | "phone" | "city";
    setFetch: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    errorInfo: string;
}

const InputField: React.FC<InputFieldProps> = ({label, value, setValue, valueType, setFetch, isLoading, errorInfo}) => {

    const {isMobile, CreateDebouncedValue} = useUtil();
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [buttonHovered, setButtonHovered] = useState<boolean>(false);
    const debouncedHover: boolean = CreateDebouncedValue(buttonHovered, 300);
    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideRight" | "animate-slideLeft" | null>(null);
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<"Edit" | "Save">("Edit");
    const componentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [invalidInput, setInvalidInput] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const handleActivateButton = () => {
        setButtonHovered(true);
    }

    const handleDeactivateButton = () => {
        setButtonHovered(false);
    }

    const toggleButton = () => {
        setButtonActive(true);
        setButtonAnimation("animate-slideRight");
    }

    useEffect(() => {
        if (buttonHovered && debouncedHover) {
            setButtonActive(true);
            setButtonAnimation("animate-slideRight");
        }
        if (!buttonHovered && !debouncedHover) {
            setButtonAnimation("animate-slideLeft");
            setTimeout(() => {
                setButtonActive(false);
                setButtonAnimation(null);
            }, 300)
        }
    }, [buttonHovered, debouncedHover]);

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                if (buttonLabel === "Save") {
                    setFetch(prev => !prev);
                }
                setButtonHovered(false);
                setInputActive(false);
                setButtonLabel("Edit");
                setButtonAnimation("animate-slideLeft");
                setInvalidInput(false);
                setAdditionalInfo(null);
                setTimeout(() => {
                    setButtonActive(false);
                    setButtonAnimation(null);
                }, 300)
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
    }, [inputActive, buttonActive, setFetch, buttonLabel]);  //adds event listener to deactivate button

    useEffect(() => {
        if (inputActive && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputActive]);   //sets cursor inside input

    const handleEditButtonClick = () => {
        setInputActive(true);
        setButtonLabel("Save");
        setInvalidInput(false);
        setAdditionalInfo(null);
    }

    //saves values to db
    const handleSaveButtonClick = async () => {
        if (isDisabled) return;
        if (value.length >= 3 || value.length === 0) {
            if (value.length <= 15) {
                setIsDisabled(true);
                setAdditionalInfo(null);
                try {
                    const response = await api.post(`api/contact-set-${valueType}`, {
                        [valueType]: value
                    });
                    if (response.data) {
                        setFetch(prev => !prev);
                        setInputActive(false);
                        setButtonLabel("Edit");
                        setButtonActive(false);
                        setButtonHovered(false);
                        setButtonAnimation(null);
                        setInvalidInput(false);
                    } else {
                        setInvalidInput(true);
                    }
                } catch (error) {
                    console.error("Error changing value: ", error);
                } finally {
                    setTimeout(() => {
                        setIsDisabled(false);
                    }, 2000)
                }
            } else {
                setInvalidInput(false);
                setAdditionalInfo("Provided value is too long.")
            }
        } else {
            setInvalidInput(false);
            setAdditionalInfo("Provided value is too short.");
        }
    }

    //let put country code and '+' at the beginning
    const formatPhoneNumber = (phoneNumber: string): string => {
        let cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

        if (cleanedNumber.startsWith("+")) {
            cleanedNumber = "+" + cleanedNumber.slice(1).replace(/\+/g, "");
        } else {
            cleanedNumber = cleanedNumber.replace(/\+/g, "");
        }

        return cleanedNumber;
    };

    return (
        <div className="flex flex-col lg:gap-[1px] 2xl:gap-[2px]">
            <label className="text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:test-2xl">
                {label}
            </label>
            <div className="flex flex-row w-fit text-base lg:text-lg xl:text-xl 2xl:text-2xl
            3xl:test-3xl cursor-pointer"
                 onMouseEnter={!isMobile && buttonLabel === "Edit" ? handleActivateButton : undefined}
                 onMouseLeave={!isMobile && buttonLabel === "Edit" ? handleDeactivateButton : undefined}
                 onTouchEnd={isMobile && buttonLabel === "Edit" ? toggleButton : undefined}
                 ref={componentRef}>
                <div className={`w-[165px] sm:w-[140px] lg:w-[180px] xl:w-[200px] 2xl:w-[240px] 3xl:w-[270px]
                h-[25px] lg:h-[29px] xl:h-[33px] 2xl:h-9 3xl:h-[38px] z-20 bg-lowLime relative
                ${buttonActive ? "mr-[3px] lg:mr-1 xl:mr-[5px] 2xl:mr-[6px] 3xl:mr-[7px]" : ""}`}>
                    {!isLoading ?
                        <div className={`flex items-center w-full h-full px-[3px] lg:px-[4px] xl:px-[5px]
                        2xl:px-[6px] 3xl:px-[7px] rounded-sm overflow-hidden
                        ${!inputActive ? "border border-black border-opacity-10" : ""}`}>
                            {value}
                        </div> : <ContactInputLoader/>}
                    {inputActive &&
                        <input className={`absolute inset-0 focus:outline-none rounded-sm px-[3px]
                        lg:px-[4px] xl:px-[5px] 2xl:px-[6px] 3xl:px-[7px]`}
                               ref={inputRef}
                               type={valueType === "phone" ? "tel" : "text"} value={value}
                               onChange={valueType === "phone" ?
                                   (e) => setValue(formatPhoneNumber(e.target.value))
                                   : (e) => setValue(e.target.value.trim())}/>}
                    {inputActive && invalidInput || additionalInfo !== "" ?
                        <p className="text-[11px] lg:text-[13px] xl:text-[14px] 2xl:text-[16px] 3xl:text-[17px]
                        absolute left-[3px] 2xl:left-1 3xl:left-[5px] top-[21px] lg:top-[25px]
                        xl:top-[30px] 2xl:top-[33px] 3xl:top-[37px] whitespace-nowrap">
                            {inputActive && invalidInput && errorInfo} {additionalInfo !== "" ? additionalInfo : null}</p> : null}
                </div>
                {buttonActive &&
                    <button className={`w-11 lg:w-[50px] xl:w-14 2xl:w-16 3xl:w-[70px] h-[25px] lg:h-[29px]
                    xl:h-[33px] 2xl:h-9 3xl:h-[38px] border border-black border-opacity-40 bg-lime rounded-sm z-10
                    ${buttonAnimation}`}
                            onClick={buttonLabel === "Edit" ? handleEditButtonClick : handleSaveButtonClick}>
                        {buttonLabel}
                    </button>
                }
            </div>
        </div>
    )
}

export default InputField