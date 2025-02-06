import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {api} from "../../../../../../../../Config/AxiosConfig/AxiosConfig.ts";
import ContactInputLoader from "../../../../../../../../SharedComponents/Additional/Loading/ContactInputLoader.tsx";
import SuggestionsBar from "./Atomic/SuggestionsBar.tsx";
import {useButton} from "../../../../../../../../CustomHooks/useButton.ts";

interface InputFieldProps {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>;
    valueType: "name" | "phone" | "city";
    setFetch: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    errorInfo: string;
    isCityInput?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({label, value, setValue, valueType, setFetch, isLoading, errorInfo, isCityInput}) => {

    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<"Edit" | "Save">("Edit");
    const componentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [invalidInput, setInvalidInput] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile, CreateDebouncedValue} = useUtil();
    const debouncedValue: string | null = isCityInput ? CreateDebouncedValue(value, 300) : null;
    const [citySuggestions, setCitySuggestions] = useState<string[] | null>(isCityInput ? [] : null)
    const [clickedSuggestion, setClickedSuggestion] = useState<string | null>(isCityInput ? "" : null);

    const handleEditButtonClick = () => {
        setInputActive(true);
        setButtonLabel("Save");
    }

    //saves values to db
    const handleSaveButtonClick = async () => {
        if (isDisabled) return;
        if (value.length < 3 && value.length !== 0) {
            setInvalidInput(false);
            setAdditionalInfo("Provided value is too short.");
            return;
        }
        if (value.length > 20 || valueType === "city" && value.length > 40) {
            setInvalidInput(false);
            setAdditionalInfo("Provided value is too long.");
            return;
        }

        setCitySuggestions(null);
        setIsDisabled(true);
        setAdditionalInfo(null);

        try {
            const response = await api.put(`api/contact-set-${valueType}`, {
                [valueType]: value
            });
            if (response.data) {
                setFetch(prev => !prev);
                setInputActive(false);
                setButtonLabel("Edit");
                setInvalidInput(false);
                setCitySuggestions(null);
                handleEnd();
            } else {
                setInvalidInput(true);
            }
        } catch (error) {
            console.error("Error changing value: ", error);
        } finally {
            setIsDisabled(false);
        }
    }

    //focus input when edit button is clicked and deactivates when clicked away
    useEffect(() => {
        //put focus on input
        if (inputActive && inputRef.current) {
            inputRef.current.focus();
        }

        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                if (buttonLabel === "Save") {
                    setFetch(prev => !prev);
                }
                setInputActive(false);
                setButtonLabel("Edit");
                setInvalidInput(false);
                setAdditionalInfo(null);
                setCitySuggestions(null);
            }
        };

        //adds event listener to deactivate button
        if (inputActive) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, setFetch, buttonLabel]);

    //for phone only, let put country code and '+' at the beginning
    const formatPhoneNumber = (phoneNumber: string): string => {
        let cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

        if (cleanedNumber.startsWith("+")) {
            cleanedNumber = "+" + cleanedNumber.slice(1).replace(/\+/g, "");
        } else {
            cleanedNumber = cleanedNumber.replace(/\+/g, "");
        }

        return cleanedNumber;
    };

    //fetches cities suggestions based on input
    useEffect(() => {
        if (!debouncedValue || !inputActive) {
            setCitySuggestions(null);
            return;
        }

        if (value === clickedSuggestion) return;

        setInvalidInput(false);
        setAdditionalInfo(null);

        const fetchCitySuggestions = async () => {
            try {
                const response = await api.get('api/get-city-suggestions', {
                    params: {value}
                });
                if (response.data) {
                    setCitySuggestions(response.data);
                }
            } catch (error) {
                console.error("Error fetching city suggestions: ", error);
            }
        }

        fetchCitySuggestions();

    }, [debouncedValue]);

    return (
        <div className="flex flex-col gap-[2px] m:gap-1">
            <label className="text-lg m:text-xl">
                {label}
            </label>
            <div className="flex flex-row justify-between w-[280px] m:w-[350px] h-fit text-xl m:text-2xl"
                 ref={componentRef}>
                <div className="w-[220px] m:w-[280px] h-9 m:h-10 relative z-20">
                    {!isLoading ?
                        <div className={`flex items-center w-full h-full px-1 m:px-[6px] rounded-sm overflow-hidden whitespace-nowrap
                        ${!inputActive ? "border border-black border-opacity-10" : ""}`} title={value}>
                            {value}
                        </div> : <ContactInputLoader/>}
                    {inputActive &&
                        <input className={`w-full h-full absolute inset-0 focus:outline-none rounded-sm px-1 m:px-[6px]`}
                            ref={inputRef} type={valueType === "phone" ? "tel" : "text"}
                               value={value} onChange={valueType === "phone" ?
                                (e) => setValue(formatPhoneNumber(e.target.value))
                                : valueType === "name" ? (e) => setValue(e.target.value.trim())
                                    : (e) => setValue(e.target.value)}/>}
                    {inputActive && invalidInput || additionalInfo !== "" ?
                        <p className="text-sm m:text-base absolute left-[3px] m:left-[5px] top-10 m:top-11 whitespace-nowrap">
                            {inputActive && invalidInput && errorInfo} {additionalInfo !== "" ? additionalInfo : null}</p> : null}
                    {isCityInput && inputActive &&
                        <SuggestionsBar citySuggestions={citySuggestions} setCitySuggestions={setCitySuggestions}
                                        setValue={setValue} setClickedSuggestion={setClickedSuggestion}/>}
                </div>
                <button className={`w-14 m:w-16 h-9 m:h-10 border border-black border-opacity-40 bg-lime rounded-sm
                        ${buttonColor ? "text-white" : ""}`}
                        onClick={buttonLabel === "Edit" ? handleEditButtonClick : handleSaveButtonClick}
                        onMouseEnter={!isMobile ? handleStart : undefined}
                        onMouseLeave={!isMobile ? handleEnd : undefined}
                        onTouchStart={isMobile ? handleStart : undefined}
                        onTouchEnd={isMobile ? handleEnd : undefined}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    )
}

export default InputField