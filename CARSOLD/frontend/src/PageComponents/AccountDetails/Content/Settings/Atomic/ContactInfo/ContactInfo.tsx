import React, {useEffect, useState} from "react";
import InputField from "./Atomic/InputField.tsx";
import {api} from "../../../../../../Config/AxiosConfig/AxiosConfig.ts";

const ContactInfo: React.FC = () => {

    const [name, setName] = useState<string>("");

    useEffect(() => {
        const fetchName = async () => {
            try {
                const response = await api.get("api/contact-fetch-name");
                if (response.data.name) {
                    setName(response.data.name);
                }
            } catch(error) {
                console.error("Error fetching name: ", error);
            }
        }
        fetchName().then();
    }, []);

    return (
        <InputField label="Name" value={name} setValue={setName} valueType="name"/>
    )
}

export default ContactInfo