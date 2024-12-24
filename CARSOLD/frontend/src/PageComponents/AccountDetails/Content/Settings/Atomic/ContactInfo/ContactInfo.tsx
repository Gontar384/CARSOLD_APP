import React, {useEffect, useState} from "react";
import InputField from "./Atomic/InputField.tsx";
import {api} from "../../../../../../Config/AxiosConfig/AxiosConfig.ts";
import SwitchButton from "./Atomic/SwitchButton.tsx";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";

const ContactInfo: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [city, setCity] = useState<string>("");

    const [fetch, setFetch] = useState<boolean>(false);
    const [infoLoading, setInfoLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchName = async () => {
            setInfoLoading(true)
            try {
                const response = await api.get("api/fetch-contact-info");
                if (response.data.name) {
                    setName(response.data.name);
                } else {
                    setName("");
                }
                if (response.data.phone) {
                    setPhone(response.data.phone);
                } else {
                    setPhone("");
                }
                if (response.data.city) {
                    setCity(response.data.city);
                } else {
                    setCity("");
                }
            } catch (error) {
                console.error("Error fetching info: ", error);
            } finally {
                setInfoLoading(false);
            }
        }
        fetchName().then();
    }, [fetch]);

    const {isWide} = useUtil();

    return (
        <div className="flex flex-col m-5 xs:m-6 sm:m-0 sm:mt-2 sm:ml-2 lg:mt-3 lg:ml-3 xl:mt-4
        xl:ml-4 2xl:mt-5 2xl:ml-5 3xl:mt-6 3xl:ml-6">
            <p className="text-[10px] xs:text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:test-xl
            mb-3 xs:mb-4 sm:mb-[3px] lg:mb-1 xl:mb-[7px] 2xl:mb-[9px] 3xl:mb-[11px]">Edit contact details:</p>
            <div className={`flex ${isWide ? "flex-col" : "flex-row"}`}>
                <div className="flex flex-col gap-2 xs:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-7">
                    <InputField label="Name" value={name} setValue={setName} valueType="name" setFetch={setFetch}
                                infoLoading={infoLoading}/>
                    <InputField label="Phone" value={phone} setValue={setPhone} valueType="phone" setFetch={setFetch}
                                infoLoading={infoLoading}/>
                    <InputField label="City" value={city} setValue={setCity} valueType="city" setFetch={setFetch}
                                infoLoading={infoLoading}/>
                </div>
                <div className={`flex ${isWide? "" : "justify-center" } w-full`}>
                    <SwitchButton/>
                </div>
            </div>
        </div>
    )
}

export default ContactInfo