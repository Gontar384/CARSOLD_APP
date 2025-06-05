import React, {useEffect, useState} from "react";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fetchEmail} from "../../../../../../ApiCalls/Services/UserService.ts";

const EmailAddress: React.FC = () => {
    const {t} = useLanguage();
    const [email, setEmail] = useState<string>("...");

    useEffect(() => {
        const handleFetchEmail = async () => {
            try {
                const response = await fetchEmail();
                if (response.data) setEmail(response.data.value);
            } catch (error: unknown) {
                console.error("Unexpected error while fetching e-mail address: ", error);
            }
        };
        handleFetchEmail();
    }, []);

    return (
        <div className="text-xl m:text-2xl w-[300px] m:w-[395px] mt-20 m:mt-24">
            <h2 className="flex flex-row items-center justify-center w-full gap-1 m:gap-1.5">
                <FontAwesomeIcon icon={faEnvelope} />
                {t("emailAddress")}
            </h2>
            <p className="font-semibold mt-0.5 m:mt-1 break-all text-center w-full">{email}</p>
        </div>
    )
};

export default EmailAddress