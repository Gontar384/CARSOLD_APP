import React, {useEffect, useState} from "react";
import InputField from "./Atomic/InputField.tsx";
import {api} from "../../../../../../Config/AxiosConfig/AxiosConfig.ts";

const ContactInfo: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [city, setCity] = useState<string>("");

    const [fetch, setFetch] = useState<boolean>(false);

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await api.get("api/fetch-contact-info");
                if (response.data.name) {
                    setName(response.data.name);
                }
                if (response.data.phone) {
                    setPhone(response.data.phone);
                }
                if (response.data.city) {
                    setCity(response.data.city);
                }
            } catch (error) {
                console.error("Error fetching info: ", error);
            }
        }
        fetchName().then();
    }, [fetch]);

    return (
        <div className="flex flex-col m-5 xs:m-6 sm:m-0 sm:mt-2 sm:ml-2 lg:mt-3 lg:ml-3 xl:mt-4
        xl:ml-4 2xl:mt-5 2xl:ml-5 3xl:mt-6 3xl:ml-6">
            <p className="text-[10px] xs:text-xs lg:text-sm xl:text-base 2xl:text-lg 3xl:test-xl
            mb-3 xs:mb-4 sm:mb-[3px] lg:mb-1 xl:mb-[7px] 2xl:mb-[9px] 3xl:mb-[11px]">Fill contact details:</p>
            <div className="flex flex-col gap-2 xs:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 3xl:gap-7">
                <InputField label="Name" value={name} setValue={setName} valueType="name" setFetch={setFetch}/>
                <InputField label="Phone" value={phone} setValue={setPhone} valueType="phone" setFetch={setFetch}/>
                <InputField label="City" value={city} setValue={setCity} valueType="city" setFetch={setFetch}/>
            </div>
        </div>
    )
}

export default ContactInfo