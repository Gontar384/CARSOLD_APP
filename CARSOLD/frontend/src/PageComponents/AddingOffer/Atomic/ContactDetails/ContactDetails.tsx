import React, {useEffect, useState} from "react";
import {fetchContactInfo, updateAndFetchContactPublic} from "../../../../ApiCalls/Services/UserService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsRotate, faLock, faLockOpen} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

const ContactDetails: React.FC = () => {

    const [contact, setContact] = useState({
        name: "",
        phone: "",
        city: "",
    });
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [animation, setAnimation] = useState<"animate-spin" | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {isMobile} = useUtil();

    useEffect(() => {
        const handleFetchContactDetails = async () => {
            try {
                const info = await fetchContactInfo();
                const isPublic = await updateAndFetchContactPublic(null);
                if (info.data.name) setContact(prev => ({...prev, name: info.data.name}));
                if (info.data.phone) setContact(prev => ({...prev, phone: info.data.phone}));
                if (info.data.city) setContact(prev => ({...prev, city: info.data.city}));
                if (isPublic.data) setIsPublic(isPublic.data.value);
            } catch (error) {
                console.error("Error fetching contact details: ", error);
            }
        }
        handleFetchContactDetails();
    }, [refresh]);

    const handleRefresh = () => {
        if (isDisabled) return;
        setIsDisabled(true);
        setRefresh(prev => !prev);
        setAnimation("animate-spin");
        setTimeout(() => {
            setAnimation(null);
            setIsDisabled(false);
        }, 500)
    };

    return (
        <div className="flex flex-col border-2 border-gray-300 rounded-md bg-white w-11/12 max-w-[700px] p-3 m:p-4">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-3 mb-6 m:mb-8 relative">
                    <p className="text-lg m:text-xl">Contact details</p>
                    {Object.entries(contact).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-base m:text-lg">{key === "name" ? "Name:" : key === "phone" ? "Phone:" : "City:"}</p>
                            <p className="flex items-center pl-1 w-44 m:w-48 h-9 m:h-10 text-lg m:text-xl border border-gray-400
                            text-gray-700 bg-gray-50 rounded overflow-hidden truncate cursor-not-allowed">
                                {value}
                            </p>
                        </div>
                    ))}
                    <button className="absolute top-1 m:top-0 right-0 animate-spin"
                    onClick={handleRefresh}>
                        <FontAwesomeIcon className={`text-2xl m:text-3xl ${animation}`} icon={faArrowsRotate} />
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center w-full gap-1">
                    <FontAwesomeIcon className="text-3xl m:text-4xl cursor-not-allowed" icon={isPublic ? faLockOpen : faLock}/>
                    <p className="text-base m:text-lg">{isPublic ? "Public" : "Private"}</p>
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <p className="w-2/3 text-sm m:text-base">
                    Those are your contact details for now. They will be attached to your offer, if public.
                    You can change them directly in your account settings.
                </p>
                <div className="flex justify-center items-center w-1/3">
                    <Link to={'/details/settings'} target="_blank" className={`flex justify-center items-center text-base m:text-lg 
                    w-24 m:w-28 h-9 m:h-10 bg-gray-200 border-2 border-gray-300 rounded ${!isMobile && "hover:brightness-90"}`}>
                        Change
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ContactDetails