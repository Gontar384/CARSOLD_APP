import React, {useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ChatsBar from "./Atomic/ChatsBar.tsx";
import ChatWindow from "./Atomic/ChatWindow.tsx";

export interface Sent {
    username: string;
    lastMessage: string;
    timestamp: string;
    sentBy: string;
}

const Messages: React.FC = () => {
    document.title = "CARSOLD | Messages";
    const {bigWidth} = useUtil();
    const [sent, setSent] = useState<Sent>({
        username: "",
        lastMessage: "",
        timestamp: "",
        sentBy: "",
    });
    const [deleted, setDeleted] = useState<string>("");
    const [markSeen, setMarkSeen] = useState<boolean>(false);

    return (
        <div className={`flex flex-1 justify-center w-full h-full
        ${bigWidth ? "flex-row mt-12" : "flex-col gap-[50px]"}`}>
            <div className={`${bigWidth ? "w-1/3 h-[660px]" : "w-full h-[520px] m:h-[600px] mb-[75px] order-2"}
            flex flex-col items-center`}>
                <div className={`flex flex-col items-center h-full overflow-auto p-1 bg-white 
                ${bigWidth ? "w-[90%]" : "w-[80%] max-w-[460px]"} border border-gray-300 shadow rounded`}>
                    <ChatsBar sent={sent} deleted={deleted} setDeleted={setDeleted} markSeen={markSeen}/>
                </div>
            </div>
            <div className={`${bigWidth ? "w-2/3 h-[660px]" : "w-full h-[520px] m:h-[600px] mt-[50px] order-1"}
            flex flex-col items-center`}>
                <div className={`flex flex-col items-center h-full p-1 bg-white 
                ${bigWidth ? "w-[90%] max-w-[850px]" : "w-[97%] max-w-[750px]"} border border-gray-300 shadow rounded`}>
                    <ChatWindow setSent={setSent} setDeleted={setDeleted} setMarkSeen={setMarkSeen}/>
                </div>
            </div>
        </div>
    )
}

export default Messages