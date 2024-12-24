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
    infoLoading: boolean;
}

const InputField: React.FC<InputFieldProps> = ({label, value, setValue, valueType, setFetch, infoLoading}) => {

    const {isMobile, CreateDebouncedValue} = useUtil();
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [buttonHovered, setButtonHovered] = useState<boolean>(false);
    const debouncedHover: boolean = CreateDebouncedValue(buttonHovered, 300);
    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideRight" | "animate-slideLeft" | null>(null);
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<"Edit" | "Save">("Edit");
    const componentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
                setButtonHovered(false);
                setButtonAnimation(null);
            }
        } catch (error) {
            console.error("Error changing name: ", error);
        }
    }

    return (
        <div className="flex flex-col lg:gap-[1px] 2xl:gap-[2px]">
            <label className="text-xs xs:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:test-2xl">
                {label}
            </label>
            <div className="flex flex-row w-fit text-sm xs:text-base lg:text-lg xl:text-xl 2xl:text-2xl
            3xl:test-3xl cursor-pointer"
                 onMouseEnter={!isMobile && buttonLabel === "Edit" ? handleActivateButton : undefined}
                 onMouseLeave={!isMobile && buttonLabel === "Edit" ? handleDeactivateButton : undefined}
                 onTouchEnd={isMobile && buttonLabel === "Edit" ? toggleButton : undefined}
                 ref={componentRef}>
                <div className={`w-[150px] xs:w-[180px] sm:w-[140px] lg:w-[180px] xl:w-[200px] 2xl:w-[240px] 3xl:w-[270px]
                h-[21px] xs:h-[25px] lg:h-[29px] xl:h-[33px] 2xl:h-9 3xl:h-[38px] relative z-20 bg-lowLime
                ${buttonActive ? "mr-[2px] xs:mr-[3px] lg:mr-1 xl:mr-[5px] 2xl:mr-[6px] 3xl:mr-[7px]" : ""}`}>
                    {!infoLoading ?
                        <div className={`flex items-center w-full h-full px-[2px] xs:px-[3px] lg:px-[4px] xl:px-[5px]
                        2xl:px-[6px] 3xl:px-[7px] rounded-sm overflow-hidden
                        ${!inputActive ? "border border-black border-opacity-10" : ""}`}>
                            {value}
                        </div> : <ContactInputLoader/>}
                    {inputActive &&
                        <input className={`absolute inset-0 focus:outline-none rounded-sm px-[2px] xs:px-[3px]
                        lg:px-[4px] xl:px-[5px] 2xl:px-[6px] 3xl:px-[7px]`}
                               ref={inputRef}
                               type="text" value={value}
                               onChange={(e) => setValue(e.target.value.trim())}/>}
                </div>
                {buttonActive &&
                    <button className={`w-10 xs:w-11 lg:w-[50px] xl:w-14 2xl:w-16 3xl:w-[70px] h-[21px] xs:h-[25px] lg:h-[29px]
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