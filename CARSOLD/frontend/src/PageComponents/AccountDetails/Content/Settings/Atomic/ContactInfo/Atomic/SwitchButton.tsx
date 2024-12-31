import React, {useEffect, useState} from "react";
import {api} from "../../../../../../../Config/AxiosConfig/AxiosConfig.ts";
import {AxiosResponse} from "axios";

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
                if (!initialLoad){
                    if (response.data.changedValue) {
                        setButtonAnimation("animate-slideOn1");
                    } else {
                        setButtonAnimation("animate-slideOff1");
                    }
                }
                if (initialLoad){
                    if (!response.data.changedValue) {
                        setButtonAnimation("animate-slideOff2");
                    } else {
                        setButtonAnimation("animate-slideOn2");
                    }
                }
            }
        } catch (error) {
            console.error("Error changing contactInfoPublic value: ", error);
        } finally {
            setTimeout(() => {
                setIsDisabled(false);
            }, 500)
        }
    }

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

        fetchContactInfoPublic().then();
    }, []);

    if (isFetching) {
        return (
            <div className="w-9 h-5 scale-[110%] lg:scale-[120%] xl:scale-[130%] 2xl:scale-[145%] 3xl:scale-[155%]
            border border-black border-opacity-40 bg-black bg-opacity-10 animate-pulse rounded-full">
            </div>
        )
    }

    return (
        <button className={`flex items-center justify-center w-9 h-5 scale-[110%] lg:scale-[120%]
        xl:scale-[130%] 2xl:scale-[145%] 3xl:scale-[155%] border border-black border-opacity-40
        rounded-full transition-all duration-300 ${isPublic ? "bg-lime" : "bg-gray-300"}`}
                onClick={handleSwitchButton}>
            <div className={`w-[calc(100%-3px)] h-[calc(100%-3px)] flex ${initialLoad ? "justify-end" : "justify-start"} relative rounded-full`}>
                    <div className={`h-full aspect-square bg-white border border-black 
                    border-opacity-5 rounded-full ${buttonAnimation}`}></div>
            </div>
        </button>
    )
}

export default SwitchButton