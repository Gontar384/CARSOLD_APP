import React, {useEffect, useState} from "react";
import {useUserUtil} from "../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {sendMessage} from "../../../../ApiCalls/Services/MessageService.ts";
import {NotFoundError, PayloadTooLarge} from "../../../../ApiCalls/Errors/CustomErrors.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

const Messages: React.FC = () => {
    const {bigWidth} = useUtil();
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
                receiverUsername: "gontar",
                content: "testMessage1asdsssssssssssssssssssssssssssjjjjjjjjjd aas da sd asdas dasda sd as das dasd sa dsa dassd asd asdas"
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
        <div className={`flex ${bigWidth ? "flex-row" : "flex-col items-center"} w-full h-full`}>
            <div className={`flex flex-col items-center ${bigWidth ? "w-1/3 h-[700px] ml-[25px] mt-[25px]" : "w-full h-[650px] order-2"} border border-red-700`}>
                <div className={`flex flex-col items-center ${bigWidth ? "w-[70%]" : "w-[70%]"} border border-black`}>
                    test
                </div>
            </div>
            <div className={`flex flex-col items-center w-2/3 ${bigWidth ? "w-1/3 h-[550px] mr-[25px] mt-[25px]" : "w-full h-[500px] order-1"} border border-blue-600`}>
                <div className={`flex flex-col items-center ${bigWidth ? "w-[90%]" : "w-[85%]"} border border-black`}>
                    test
                </div>
            </div>

            <button className="absolute bottom-0"
                    onClick={handleSendMessage}>
                Send
            </button>
        </div>
    )
}

export default Messages