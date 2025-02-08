import React, {useEffect, useState} from "react";
import InputField from "./Atomic/InputField/InputField.tsx";
import SwitchButton from "./Atomic/SwitchButton.tsx";
import {fetchContactInfo} from "../../../../../../ApiCalls/Services/UserService.ts";

const ContactInfo: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [fetch, setFetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchName = async () => {

            setIsLoading(true)
            try {
                const info = await fetchContactInfo();
                if (info.data) {
                    setName(info.data.name)
                    setPhone(info.data.phone);
                    setCity(info.data.city);
                }
            } catch (error) {
                console.error("Error fetching contact info: ", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchName();

    }, [fetch]);

    return (
        <div className="flex flex-col w-full items-center mt-[72px] m:mt-20">
            <div>
                <p className="text-lg m:text-xl mb-8 m:mb-10 w-fit">Edit contact details:</p>
                <div className="flex flex-col gap-6 m:gap-7">
                    <InputField label="Name" value={name} setValue={setName} valueType="name" setFetch={setFetch}
                                isLoading={isLoading} errorInfo="It doesn't look like a name."/>
                    <InputField label="Phone" value={phone} setValue={setPhone} valueType="phone"
                                setFetch={setFetch}
                                isLoading={isLoading} errorInfo="Wrong phone number."/>
                    <InputField label="City" value={city} setValue={setCity} valueType="city" setFetch={setFetch}
                                isLoading={isLoading} errorInfo="Wrong address." isCityInput={true}/>
                    <SwitchButton/>
                </div>
            </div>
        </div>
    )
}

export default ContactInfo