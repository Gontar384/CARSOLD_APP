import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import ContactInputLoader from "../../../../../../../../Additional/Loading/ContactInputLoader.tsx";
import SuggestionsBar from "./Atomic/SuggestionsBar.tsx";
import {useButton} from "../../../../../../../../CustomHooks/useButton.ts";
import {fetchCitySuggestions, updateCity, updateName, updatePhone} from "../../../../../../../../ApiCalls/Services/UserService.ts";
import {AxiosError} from "axios";
import {InternalServerError} from "../../../../../../../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../../../../../../../GlobalProviders/Language/useLanguage.ts";

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
    const {t, language} = useLanguage();
    const [inputActive, setInputActive] = useState<boolean>(false);
    const [buttonLabel, setButtonLabel] = useState<string>(t("contactInfo8"));
    const componentRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [invalidInput, setInvalidInput] = useState<boolean>(false);
    const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {buttonColor, bindHoverHandlers} = useButton();
    const {CreateDebouncedValue} = useUtil();
    const debouncedValue: string | null = isCityInput ? CreateDebouncedValue(value, 300) : null;
    const [citySuggestions, setCitySuggestions] = useState<string[] | null>(isCityInput ? [] : null)
    const [clickedSuggestion, setClickedSuggestion] = useState<string | null>(isCityInput ? "" : null);

    useEffect(() => {
        setButtonLabel(t("contactInfo8"));
    }, [language]); //updates save/edit buttons display when changing language

    const handleEditButtonClick = () => {
        setInputActive(true);
        setButtonLabel(t("contactInfo9"));
    }

    const handleSaveButtonClick = async () => {
        if (isDisabled) return;

        setAdditionalInfo(null);
        setCitySuggestions(null);
        if (value.length < 3 && value.length !== 0) {
            setInvalidInput(false);
            setAdditionalInfo(t("contactInfo10"));
            return;
        }
        if (value.length > 100 || valueType !== "city" && value.length > 20) {
            setInvalidInput(false);
            setAdditionalInfo(t("contactInfo11"));
            return;
        }

        setIsDisabled(true);
        try {
            if (valueType === "name") await updateName(value);
            else if (valueType === "phone") await updatePhone(value);
            else if (valueType === "city") await updateCity(value);

            setFetch(prev => !prev);
            setInputActive(false);
            setButtonLabel(t("contactInfo8"));
            setInvalidInput(false);
            setCitySuggestions(null);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 422) {
                    setInvalidInput(true);
                    console.error("Invalid value provided: ", error);
                } else if (error.response.status === 500) {
                    console.error("Problem with checking value by external api: ", error);
                } else {
                    console.error("Unexpected error during updating value: ", error);
                }
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 1000);
        }
    };

    //focus input when edit button is clicked and deactivates when clicked away
    useEffect(() => {
        if (inputActive && inputRef.current) {
            inputRef.current.focus();
        }
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                if (buttonLabel === t("contactInfo9")) {
                    setFetch(prev => !prev);
                }
                setInputActive(false);
                setButtonLabel(t("contactInfo8"));
                setInvalidInput(false);
                setAdditionalInfo(null);
                setCitySuggestions(null);
            }
        };

        if (inputActive) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, setFetch, buttonLabel]);

    const formatPhoneNumber = (phoneNumber: string): string => {
        let cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

        if (cleanedNumber.startsWith("+")) {
            cleanedNumber = "+" + cleanedNumber.slice(1).replace(/\+/g, "");
        } else {
            cleanedNumber = cleanedNumber.replace(/\+/g, "");
        }

        return cleanedNumber;
    };

    //fetches cities suggestions
    useEffect(() => {
        if (!debouncedValue || !inputActive) {
            setCitySuggestions(null);
            return;
        }
        if (value === clickedSuggestion) return;

        setInvalidInput(false);
        setAdditionalInfo(null);

        const handleFetchCitySuggestions = async () => {
            try {
                const fetched = await fetchCitySuggestions(value);
                if (fetched.data.citySuggestions) {
                    setCitySuggestions(fetched.data.citySuggestions);
                }
            } catch (error: unknown) {
                if (error instanceof InternalServerError) {
                    console.error("Problem with external api: ", error);
                } else {
                    console.error("Unexpected error during suggestions fetching: ", error);
                }
            }
        };

        handleFetchCitySuggestions();

    }, [debouncedValue]);

    return (
        <div className="flex flex-col gap-[2px] m:gap-1">
            <label className="text-lg m:text-xl">
                {label}
            </label>
            <div className="flex flex-row justify-between w-[300px] m:w-[395px] h-fit text-xl m:text-2xl"
                 ref={componentRef}>
                <div className="w-[230px] m:w-[310px] h-9 m:h-10 relative z-20">
                    {!isLoading ?
                        <div className={`flex items-center w-full h-full px-1 m:px-[6px] rounded-sm overflow-hidden whitespace-nowrap
                        ${!inputActive ? "border border-black border-opacity-10" : ""}`} title={value}>
                            {value}
                        </div> : <ContactInputLoader/>}
                    {inputActive &&
                        <input className={`w-full h-full absolute inset-0 focus:outline-none rounded-sm px-1 m:px-[6px]`}
                            ref={inputRef} type={valueType === "phone" ? "tel" : "text"}
                            value={value}
                            onChange={valueType === "name" ? (e) => setValue(e.target.value.trim())
                                : valueType === "phone" ? (e) => setValue(formatPhoneNumber(e.target.value))
                                    : (e) => setValue(e.target.value.replace(/^\s+/, ""))}/>}
                    {inputActive && (invalidInput || additionalInfo !== "") ?
                        <p className="text-sm m:text-base absolute left-[3px] m:left-[5px] top-10 m:top-11 whitespace-nowrap">
                            {inputActive && invalidInput && errorInfo} {additionalInfo !== "" ? additionalInfo : null}</p> : null}
                    {isCityInput && inputActive &&
                        <SuggestionsBar citySuggestions={citySuggestions} setCitySuggestions={setCitySuggestions}
                                        setValue={setValue} setClickedSuggestion={setClickedSuggestion}/>}
                </div>
                <button className={`w-16 m:w-[76px] h-9 m:h-10 border border-black border-opacity-40 bg-lime rounded-sm
                        ${buttonColor ? "text-white" : ""}`}
                        onClick={buttonLabel === t("contactInfo8") ? handleEditButtonClick : handleSaveButtonClick}
                        {...bindHoverHandlers()}>
                    {buttonLabel}
                </button>
            </div>
        </div>
    )
}

export default InputField