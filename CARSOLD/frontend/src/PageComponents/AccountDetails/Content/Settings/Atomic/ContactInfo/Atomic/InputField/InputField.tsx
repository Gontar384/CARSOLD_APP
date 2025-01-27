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

    const {isMobile, CreateDebouncedValue} = useUtil();
    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [elementHovered, setElementHovered] = useState<boolean>(false);
    const debouncedHover: boolean = CreateDebouncedValue(elementHovered, 300);
    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideRight" | "animate-slideLeft" | null>(null);
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<"Edit" | "Save">("Edit");
    const componentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [invalidInput, setInvalidInput] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {buttonColor, handleStart, handleEnd} = useButton();
    const debouncedValue: string | null = isCityInput ? CreateDebouncedValue(value, 300) : null;
    const [citySuggestions, setCitySuggestions] = useState<string[] | null>(isCityInput ? [] : null)
    const [clickedSuggestion, setClickedSuggestion] = useState<string | null>(isCityInput ? "" : null);

    //button and input management
    const handleActivateButton = () => {
        setElementHovered(true);
    }

    const handleDeactivateButton = () => {
        setElementHovered(false);
    }

    const toggleButton = () => {
        setButtonActive(true);
        setButtonAnimation("animate-slideRight");
    }

    useEffect(() => {

        if (elementHovered && debouncedHover) {
            setButtonActive(true);
            setButtonAnimation("animate-slideRight");
        }

        if (!elementHovered && !debouncedHover) {
            setButtonAnimation("animate-slideLeft");
            setTimeout(() => {
                setButtonActive(false);
                setButtonAnimation(null);
            }, 300)
        }
    }, [elementHovered, debouncedHover]);

    //focus input when clicked on button and deactivates when clicked away
    useEffect(() => {

        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {

                if (buttonLabel === "Save") {
                    setFetch(prev => !prev);
                }

                setElementHovered(false);
                setInputActive(false);
                setButtonLabel("Edit");
                setButtonAnimation("animate-slideLeft");
                setInvalidInput(false);
                setAdditionalInfo(null);
                setCitySuggestions(null);
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

        if (inputActive && inputRef.current) {
            inputRef.current.focus();
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, buttonActive, setFetch, buttonLabel]);  //adds event listener to deactivate button

    const handleEditButtonClick = () => {
        setInputActive(true);
        setButtonLabel("Save");
        setInvalidInput(false);
        setAdditionalInfo(null);
        setCitySuggestions(null);
        setClickedSuggestion("");
    }

    //saves values to db
    const handleSaveButtonClick = async () => {

        if (isDisabled) return;

        if (value.length < 3 && value.length !== 0) {
            setInvalidInput(false);
            setAdditionalInfo("Provided value is too short.");
            return;
        }
        if (value.length > 20 || valueType === "city" && value.length > 35) {
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
                setButtonActive(false);
                setElementHovered(false);
                setButtonAnimation(null);
                setInvalidInput(false);
                setCitySuggestions(null);
                handleEnd();
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
    }

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

        if (!debouncedValue || !inputActive) return;

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

    //to reset city suggestions
    useEffect(() => {
        if (value === "") setCitySuggestions(null);
    }, [debouncedValue]);

    return (
        <div className="flex flex-col gap-[2px] m:gap-1">
            <label className="text-lg m:text-xl">
                {label}
            </label>
            <div className="w-[280px] m:w-[350px] text-xl m:text-2xl relative">
                <div className="w-[220px] m:w-[280px] h-9 m:h-10 cursor-pointer"
                     onMouseEnter={!isMobile && buttonLabel === "Edit" ? handleActivateButton : undefined}
                     onMouseLeave={!isMobile && buttonLabel === "Edit" ? handleDeactivateButton : undefined}
                     onTouchEnd={isMobile && buttonLabel === "Edit" ? toggleButton : undefined}
                     ref={componentRef}>
                    <div className="w-full h-full bg-lowLime z-20 relative">
                        {!isLoading ?
                            <div className={`flex items-center w-full h-full px-1 m:px-[6px] rounded-sm overflow-hidden whitespace-nowrap
                        ${!inputActive ? "border border-black border-opacity-10" : ""}`} title={value}>
                                {value}
                            </div> : <ContactInputLoader/>}
                        {inputActive &&
                            <input className={`absolute inset-0 focus:outline-none rounded-sm px-1 m:px-[6px]`}
                                   ref={inputRef}
                                   type={valueType === "phone" ? "tel" : "text"} value={value}
                                   onChange={valueType === "phone" ?
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
                    {buttonActive &&
                        <button className={`w-14 m:w-16 h-9 m:h-10 absolute top-0 right-0 
                    border border-black border-opacity-40 bg-lime rounded-sm z-10
                    ${buttonAnimation} ${buttonColor ? "text-white" : ""}`}
                                onClick={buttonLabel === "Edit" ? handleEditButtonClick : handleSaveButtonClick}
                                onMouseEnter={!isMobile ? handleStart : undefined}
                                onMouseLeave={!isMobile ? handleEnd : undefined}
                                onTouchStart={isMobile ? handleStart : undefined}
                                onTouchEnd={isMobile ? handleEnd : undefined}>
                            {buttonLabel}
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default InputField