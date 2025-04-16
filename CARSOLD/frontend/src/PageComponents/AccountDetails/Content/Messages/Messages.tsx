import React, {useEffect, useState} from "react";
import {useUserUtil} from "../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {getConversation, getUserConversations, sendMessage} from "../../../../ApiCalls/Services/MessageService.ts";
import {BadRequestError, NotFoundError, PayloadTooLarge} from "../../../../ApiCalls/Errors/CustomErrors.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ChatsLoader from "../../../../Additional/Loading/ChatsLoader.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useMessages} from "../../../../GlobalProviders/Messages/useMessages.ts";
import {useNavigate, useSearchParams} from "react-router-dom";

const Messages: React.FC = () => {
    interface Conversation {
        username: string;
        profilePic: string;
        lastMessage: string;
        timestamp: string;
        seen: boolean;
    }
    interface MessageSent {
        senderUsername: string;
        receiverUsername: string;
        content: string;
    }
    interface Message {
        content: string;
        seen: boolean;
        timestamp: string;
    }
    interface WholeConversation {
        username: string;
        profilePic: string;
        messages: Message[];
    }
    const {bigWidth, isMobile} = useUtil();
    const {username} = useUserUtil();
    const [message, setMessage] = useState<MessageSent | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [imageError, setImageError] = useState<boolean>(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const {notification} = useMessages();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const senderUsername: string | null = searchParams.get("username");
    const [selectedConversation, setSelectedConversation] = useState<WholeConversation | null>(null);

    useEffect(() => {
        if (username) {
            setMessage({
                senderUsername: username,
                receiverUsername: "gontar",
                content: "wsdasdasd"
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
    }; //sending message

    useEffect(() => {
        const handleGetUserConversations = async () => {
            setFetched(false);
            try {
                const conversations = await getUserConversations();
                if (conversations.data) {
                    const formattedConversations = conversations.data.map((conv: Conversation) => ({
                        username: conv.username ?? "",
                        profilePic: conv.profilePic ?? "",
                        lastMessage: conv.lastMessage ?? "",
                        timestamp: conv.timestamp ?? "",
                        seen: conv.seen ?? true,
                    }));
                    setConversations(formattedConversations);

                    // const extendedConversations = Array(10)
                    //     .fill(formattedConversations)
                    //     .flat()
                    //     .map((conv, idx) => ({
                    //         ...conv,
                    //         username: `${conv.username}_${idx}`, // make each username unique to avoid key/index issues
                    //         timestamp: new Date(Date.now() - idx * 1000000).toISOString() // different timestamps
                    //     }));
                    //
                    // setConversations(extendedConversations);

                }
            } catch (error) {
                console.error("Unexpected error when fetching user conversations: ", error);
            } finally {
                setFetched(true);
            }
        };
        handleGetUserConversations();
    }, [notification]); //fetching conversations

    useEffect(() => {
        const handleFetchConversation = async (username: string | null) => {
            if (!username) return;
            try {
                const wholeConv = await getConversation(username, 0, 10);
                if (wholeConv.data) {
                    const formattedWholeConv: WholeConversation = {
                        username: wholeConv.data.username ?? "",
                        profilePic: wholeConv.data.profilePic ?? "",
                        messages: wholeConv.data.messages.map((message: { content: string, seen: boolean, timestamp: string }) => ({
                            content: message.content ?? "",
                            seen: message.seen ?? true,
                            timestamp: message.timestamp ?? "",
                        })),
                    };
                    setSelectedConversation(formattedWholeConv);
                    console.log(formattedWholeConv)
                }
            } catch (error: unknown) {
                if (error instanceof BadRequestError) {
                    console.error("Bad message request: ", error);
                } else if (error instanceof NotFoundError) {
                    console.error("User not found: ", error);
                } else {
                    console.error("Unexpected error when fetching conversation: ", error);
                }
            }
        };
        if (senderUsername) handleFetchConversation(senderUsername);
    }, [senderUsername]);

    return (
        <div className={`flex ${bigWidth ? "flex-row" : "flex-col items-center"} w-full h-full`}>
            <div className={`${bigWidth ? "w-1/3 h-[700px] ml-[25px] mt-[25px]" : "w-full h-[500px] mt-[50px] mb-[75px] order-2"}
            flex flex-col items-center `}>
                <div className={`flex flex-col items-center ${conversations.length === 0 && "justify-center"} overflow-auto
                h-full p-1 bg-white ${bigWidth ? "w-[90%]" : "w-[75%] m:w-[65%]"} border border-gray-300 shadow rounded`}>
                    {fetched ? (
                        conversations.length > 0 ? (
                                conversations.map((conv, index) => (
                                    <div key={index} className={`flex flex-row items-center w-full p-2 gap-2 border 
                                    border-gray-300 cursor-pointer ${hovered === index && "scale-[101%] shadow-bottom"}`}
                                         onClick={() => navigate(`/details/messages?username=${conv.username}`)}
                                         onMouseEnter={!isMobile ? () => setHovered(index) : undefined}
                                         onMouseLeave={!isMobile ? () => setHovered(null) : undefined}
                                         onTouchStart={isMobile ? () => setHovered(index) : undefined}
                                         onTouchEnd={isMobile ? () => setHovered(null) : undefined}>
                                        {conv.profilePic !== "" && !imageError ?
                                            <img src={conv.profilePic} alt="Img" onError={() => setImageError(true)}
                                                 className="w-10 h-10 m:w-11 m:h-11 rounded-full object-cover"/>
                                            : <FontAwesomeIcon icon={faCircleUser} className="w-7 h-7 m:w-8 m:h-8"/>}
                                        <div className="flex flex-col w-full truncate">
                                            <div className="flex flex-row justify-between items-center gap-2">
                                                <span className="font-bold text-sm m:text-base">{conv.username}</span>
                                                <span className="text-[10px] m:text-xs text-gray-500">
                                                    {new Date(conv.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className={`text-xs m:text-sm text-gray-700 ${conv.seen ? "font-semibold" : ""}`}>
                                                {conv.lastMessage}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-sm m:text-base">No conversations found.</div>
                            )
                    ) : (
                        <ChatsLoader/>
                    )}
                </div>
            </div>
            <div className={`${bigWidth ? "w-2/3 h-[600px] mr-[25px] mt-[25px]" : "w-full h-[500px] mt-[50px] order-1"}
            flex flex-col items-center`}>
                <div className={`${bigWidth ? "w-[90%]" : "w-[90%] m:w-[85%]"} border border-gray-300 shadow rounded
                flex flex-col items-center h-full`}>
                    conversation
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