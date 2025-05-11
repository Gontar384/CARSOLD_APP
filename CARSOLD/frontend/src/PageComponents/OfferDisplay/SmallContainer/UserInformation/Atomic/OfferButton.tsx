import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faMessage} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {activateConversation} from "../../../../../ApiCalls/Services/MessageService.ts";
import {BadRequestError, NotFoundError} from "../../../../../ApiCalls/Errors/CustomErrors.ts";

interface OfferButtonProps {
    permission: boolean;
    id: number | null;
    username: string;
}

const OfferButton: React.FC<OfferButtonProps> = ({permission, id, username}) => {
    const {buttonColor, bindHoverHandlers} = useButton();
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleSendMessage = async () => {
        if (disabled) return;
        setDisabled(true);
        if (!isAuthenticated) {
            navigate("/authenticate/login");
            return;
        } else {
            try {
                await activateConversation(username);
                navigate(`/details/messages?username=${username}`);
            } catch (error: unknown) {
                if (error instanceof NotFoundError) {
                    console.error("User not found: ", error);
                } else if (error instanceof BadRequestError) {
                    console.error("You cannot have conversation with yourself: ", error);
                }
            } finally {
                setDisabled(false);
            }
        }
    };

    return (
        <div className="flex justify-center w-full">
            <button className={`flex flex-row items-center justify-center gap-2 m:gap-3 bg-lime border border-gray-600 rounded-lg w-48 h-11 m:w-56 m:h-12 
          ${buttonColor && "brightness-[97%] shadow"}`}
                    {...bindHoverHandlers()} onClick={permission ? () => navigate(`/modifyingOffer/${id}`) : handleSendMessage}>
                <FontAwesomeIcon icon={permission ? faGear : faMessage} className="text-2xl m:text-3xl text-gray-600"/>
                <p className="text-xl m:text-2xl text-gray-600">{permission ? "Edit offer" : "Send message"}</p>
            </button>
        </div>
    )
};

export default OfferButton