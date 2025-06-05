import React, {useEffect, useState} from "react";
import InputField from "./Atomic/InputField/InputField.tsx";
import SwitchButton from "./Atomic/SwitchButton.tsx";
import {fetchContactInfo} from "../../../../../../ApiCalls/Services/UserService.ts";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";

const ContactInfo: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [fetch, setFetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {t} = useLanguage();

    useEffect(() => {
        const handleFetchContactInfo = async () => {
            setIsLoading(true)
            try {
                const info = await fetchContactInfo();
                if (info.data.name) setName(info.data.name);
                else setName("");
                if (info.data.phone) setPhone(info.data.phone);
                else setPhone("");
                if (info.data.city) setCity(info.data.city);
                else setCity("");
            } catch (error) {
                console.error("Error fetching contact info: ", error);
            } finally {
                setIsLoading(false);
            }
        }

        handleFetchContactInfo();

    }, [fetch]);

    return (
        <div className="mt-20 m:mt-24">
            <h2 className="text-xl m:text-2xl mb-8 m:mb-10 text-center">{t("contactInfo12")}</h2>
            <div className="flex flex-col gap-6 m:gap-7">
                <InputField label={t("contactInfo1")} value={name} setValue={setName} valueType="name" setFetch={setFetch}
                            isLoading={isLoading} errorInfo={t("contactInfo4")}/>
                <InputField label={t("contactInfo2")} value={phone} setValue={setPhone} valueType="phone" setFetch={setFetch}
                            isLoading={isLoading} errorInfo={t("contactInfo5")}/>
                <InputField label={t("contactInfo3")} value={city} setValue={setCity} valueType="city" setFetch={setFetch}
                            isLoading={isLoading} errorInfo={t("contactInfo6")} isCityInput={true}/>
                <SwitchButton/>
            </div>
        </div>
    )
}

export default ContactInfo