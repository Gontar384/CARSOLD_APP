import React, {useEffect, useState} from "react";
import {useUserUtil} from "../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {sendMessage} from "../../../../ApiCalls/Services/MessageService.ts";
import {NotFoundError, PayloadTooLarge} from "../../../../ApiCalls/Errors/CustomErrors.ts";

const Messages: React.FC = () => {
    interface MessageSent {
        senderUsername: string;
        receiverUsername: string;
        content: string;
    }
    const {username} = useUserUtil();
    const [message, setMessage] = useState<MessageSent | null>(null);
    useEffect(() => {
        if (username) {
            setMessage({
                senderUsername: username,
                receiverUsername: "gontarek384",
                content: "testMessage"
            });
        }
    }, [username]);

    const handleSendMessage = async () => {
        try {
            await sendMessage(message);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                console.error("Message receiver not found: ", error);
            } else if (error instanceof PayloadTooLarge) {
                console.error("Message is too long: ", error);
            } else {
                console.error("Unexpected error when sending message: ", error);
            }
        }
    };

    return (
        <div>
            <button className=""
                    onClick={handleSendMessage}>
                Send
            </button>
        </div>
    )
}

export default Messages