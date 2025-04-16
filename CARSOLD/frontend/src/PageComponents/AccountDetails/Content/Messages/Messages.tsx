import React, {useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ChatsBar, {Conversation} from "./Atomic/ChatsBar.tsx";
import ChatWindow from "./Atomic/ChatWindow.tsx";

const Messages: React.FC = () => {
    const {bigWidth} = useUtil();
    const [sent, setSent] = useState<Conversation>({
        username: "",
        profilePic: "",
        lastMessage: "",
        timestamp: "",
        seen: false,
        sentBy: "",
    });

    return (
        <div className={`flex ${bigWidth ? "flex-row" : "flex-col items-center"} w-full h-full`}>
            <div className={`${bigWidth ? "w-1/3 h-[700px] ml-[25px] mt-[25px]" : "w-full h-[550px] mt-[50px] mb-[75px] order-2"}
            flex flex-col items-center `}>
                <div className={`flex flex-col items-center h-full overflow-auto p-1 bg-white 
                ${bigWidth ? "w-[90%]" : "w-[75%] m:w-[65%]"} border border-gray-300 shadow rounded`}>
                    <ChatsBar sent={sent}/>
                </div>
            </div>
            <div className={`${bigWidth ? "w-2/3 h-[700px] mr-[25px] mt-[25px]" : "w-full h-[550px] mt-[50px] order-1"}
            flex flex-col items-center`}>
                <div className={`flex flex-col items-center h-full p-1 bg-white 
                ${bigWidth ? "w-[90%]" : "w-[90%] m:w-[85%]"} border border-gray-300 shadow rounded`}>
                    <ChatWindow setSent={setSent}/>
                </div>
            </div>
        </div>
    )
}

export default Messages