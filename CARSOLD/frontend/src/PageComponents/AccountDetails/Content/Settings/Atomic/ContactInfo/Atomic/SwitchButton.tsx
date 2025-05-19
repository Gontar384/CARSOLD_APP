import React, {useEffect, useState} from "react";
import ContactPublicLoader from "../../../../../../../Additional/Loading/ContactPublicLoader.tsx";
import {updateAndFetchContactPublic} from "../../../../../../../ApiCalls/Services/UserService.ts";
import {useLanguage} from "../../../../../../../GlobalProviders/Language/useLanguage.ts";

const SwitchButton: React.FC = () => {

    const [isPublic, setIsPublic] = useState<boolean | null>(null);
    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideOn1" | "animate-slideOn2" | "animate-slideOff1" | "animate-slideOff2" | null>(null);
    const [initialLoad, setInitialLoad] = useState<boolean | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {t} = useLanguage();

    const handleSwitchButton = async () => {
        if (isDisabled) return;

        setIsDisabled(true);
        try {
            const changed = await updateAndFetchContactPublic(!isPublic);
            if (changed.data) {
                setIsPublic(changed.data.value);

                const animationClass = initialLoad
                    ? changed.data.value ? "animate-slideOn2" : "animate-slideOff2"
                    : changed.data.value ? "animate-slideOn1" : "animate-slideOff1";
                setButtonAnimation(animationClass);
            }
        } catch (error) {
            console.error("Error updating and fetching contact public: ", error);
        } finally {
            setTimeout(() => setIsDisabled(false), 500);
        }
    };

    //sets isPublic and initialLoad on initial
    useEffect(() => {
        setIsFetching(true);
        const handleFetchContactPublic = async () => {
            try {
                const isPublic = await updateAndFetchContactPublic(null);
                if (isPublic.data) {
                    setIsPublic(isPublic.data.value);
                    setInitialLoad(isPublic.data.value);
                }
            } catch (error) {
                setIsPublic(false);
                setInitialLoad(false);
                console.error("Error fetching contact public: ", error);
            } finally {
                setIsFetching(false);
            }
        };

        handleFetchContactPublic();

    }, []);

    return (
        <div className="flex flex-col gap-[2px] m:gap-1 ml-[3px]">
            <p className="text-lg m:text-xl">
                {t("contactInfo7")}
            </p>
            {!isFetching ? (
                <button className={`flex items-center justify-center w-[54px] h-[30px] m:scale-110 border border-gray-500
                rounded-full transition-all duration-300 ${isPublic ? "bg-lime" : "bg-gray-300"} `}
                        onClick={handleSwitchButton}>
                    <div className={`w-[calc(100%-6px)] h-[calc(100%-6px)] flex ${initialLoad ? "justify-end" : "justify-start"} rounded-full`}>
                        <div className={`h-full aspect-square bg-white border border-gray-400 rounded-full ${buttonAnimation}`}></div>
                    </div>
                </button>
            ) : (
                <ContactPublicLoader/>
            )}
        </div>
    )
}

export default SwitchButton