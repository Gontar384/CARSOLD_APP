import React, {useEffect, useState} from "react";
import {api} from "../../../../../../../Config/AxiosConfig/AxiosConfig.ts";
import {AxiosResponse} from "axios";
import ContactPublicLoader from "../../../../../../../SharedComponents/Additional/Loading/ContactPublicLoader.tsx";

const SwitchButton: React.FC = () => {

    const [isPublic, setIsPublic] = useState<boolean | null>(null);
    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideOn1" | "animate-slideOn2" | "animate-slideOff1" | "animate-slideOff2" | null>(null);
    const [initialLoad, setInitialLoad] = useState<boolean | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    //changes contactPublic in DB and fetches its value, sets animations to button
    const handleSwitchButton = async () => {

        if (isDisabled) return;

        setIsDisabled(true);

        try {
            const response: AxiosResponse = await api.put('api/change-contactInfoPublic', {
                isPublic: !isPublic,
            });

            if (response.data) {
                setIsPublic(response.data.changedValue);

                const animationClass = initialLoad
                    ? response.data.changedValue ? "animate-slideOn2" : "animate-slideOff2"
                    : response.data.changedValue ? "animate-slideOn1" : "animate-slideOff1";

                setButtonAnimation(animationClass);
            }
        } catch (error) {
            console.error("Error changing contactInfoPublic value: ", error);
        } finally {
            setTimeout(() => {
                setIsDisabled(false);
            }, 500);
        }
    };

    //sets isPublic and initialLoad only on initial load
    useEffect(() => {

        setIsFetching(true);

        const fetchContactInfoPublic = async () => {
            try {
                const response: AxiosResponse = await api.get('api/fetch-contactInfoPublic');
                if (response.data) {
                    setIsPublic(response.data.isPublic);
                    setInitialLoad(response.data.isPublic);
                }
            } catch (error) {
                console.error("Error fetching contactInfoPublic: ", error);
            } finally {
                setIsFetching(false);
            }
        }

        fetchContactInfoPublic();

    }, []);

    return (
        <div className="flex flex-col gap-[2px] m:gap-1">
            <p className="text-lg m:text-xl">
                Public</p>
            {!isFetching ? (
                <button className={`flex items-center justify-center w-[54px] h-[30px] m:scale-110 border border-black border-opacity-40
                rounded-full transition-all duration-300 ${isPublic ? "bg-lime" : "bg-gray-300"} `} onClick={handleSwitchButton}>
                    <div className={`w-[calc(100%-6px)] h-[calc(100%-6px)] flex ${initialLoad ? "justify-end" : "justify-start"} relative rounded-full`}>
                        <div className={`h-full aspect-square bg-white border border-black 
                        border-opacity-5 rounded-full ${buttonAnimation}`}></div>
                    </div>
                </button>
            ) : (
                <ContactPublicLoader/>
            )}
        </div>
    )
}

export default SwitchButton