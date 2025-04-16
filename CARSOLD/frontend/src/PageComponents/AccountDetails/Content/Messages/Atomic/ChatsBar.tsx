import React, {useEffect, useState} from "react";
import {useMessages} from "../../../../../GlobalProviders/Messages/useMessages.ts";
import {getAllConversations} from "../../../../../ApiCalls/Services/MessageService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import ChatsLoader from "../../../../../Additional/Loading/ChatsLoader.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface ChatsBarProps {
    sent: Conversation;
}
export interface Conversation {
    username: string;
    profilePic: string;
    lastMessage: string;
    timestamp: string;
    seen: boolean;
    sentBy: string;
}

const ChatsBar: React.FC<ChatsBarProps> = ({ sent }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const {notification} = useMessages();
    const [imageError, setImageError] = useState<boolean>(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const navigate = useNavigate();
    const {isMobile} = useUtil();
    const [newConv, setNewConv] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const receiverUsername: string = searchParams.get("username") ?? "";

    useEffect(() => {
        const handleGetAllConversations = async () => {
            setFetched(false);
            try {
                const conversations = await getAllConversations();
                if (conversations.data) {
                    const formattedConversations = conversations.data.map((conv: Conversation) => ({
                        username: conv.username ?? "",
                        profilePic: conv.profilePic ?? "",
                        lastMessage: conv.lastMessage ?? "",
                        timestamp: conv.timestamp ?? "",
                        seen: receiverUsername === conv.username ? true : conv.seen ?? false,
                        sentBy: conv.sentBy ?? "",
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
                setNewConv(false);
                setFetched(true);
            }
        };
        handleGetAllConversations();
    }, [newConv, receiverUsername]); //fetching all conversations on initial and when notification doesn't match any conversation

    useEffect(() => {
        if (!notification || !notification.senderUsername) return;
        const exists = conversations.some(conv => conv.username === notification.senderUsername);
        if (exists) {
            setConversations(prev =>
                prev.map(conv =>
                    conv.username === notification.senderUsername
                        ? {
                            ...conv,
                            username: notification.senderUsername,
                            lastMessage: notification.content,
                            sentBy: notification.senderUsername,
                            seen: receiverUsername === notification.senderUsername,
                        } : conv
                )
            );
        } else setNewConv(true);
    }, [notification, receiverUsername]); //updates conversation first message, based on notification

    useEffect(() => {
        if (!sent || !sent.username) return;
        const exists = conversations.some(conv => conv.username === sent.username);
        if (exists) {
            setConversations(prev =>
                prev.map(conv =>
                    conv.username === sent.username
                        ? {
                            ...conv,
                            lastMessage: sent.lastMessage,
                            sentBy: sent.sentBy,
                            seen: receiverUsername === sent.username ? true : sent.seen ?? false,
                        } : conv
                )
            );
        }
    }, [sent, receiverUsername]); //updates conversation first message, based on sent message

    return (
        <>
            {fetched ? (
                conversations.length > 0 ? (
                    conversations.map((conv, index) => (
                        <div key={index} className={`flex flex-row items-center w-full p-2 gap-2 border rounded-sm
                        border-gray-300 cursor-pointer ${hovered === index && "scale-[101%] shadow-bottom"}`}
                             onClick={() => navigate(`/details/messages?username=${conv.username}`)}
                             onMouseEnter={!isMobile ? () => setHovered(index) : undefined}
                             onMouseLeave={!isMobile ? () => setHovered(null) : undefined}
                             onTouchStart={isMobile ? () => setHovered(index) : undefined}
                             onTouchEnd={isMobile ? () => setHovered(null) : undefined}>
                            {conv.profilePic !== "" && !imageError ?
                                <img src={conv.profilePic} alt="Img" onError={() => setImageError(true)}
                                     className="w-10 h-10 m:w-11 m:h-11 rounded-full object-cover"/>
                                : <FontAwesomeIcon icon={faCircleUser} className="w-10 h-10 m:w-11 m:h-11"/>}
                            <div className="flex flex-col w-full truncate">
                                <div className="flex flex-row justify-between items-center gap-2">
                                    <span className="font-bold text-sm m:text-base">{conv.username}</span>
                                    <span className="text-[10px] m:text-xs text-gray-500">
                                        {new Date(conv.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div className={`flex flex-row items-center gap-0.5 m:gap-1 text-xs m:text-sm
                                text-gray-700 ${!conv.seen ? "font-semibold" : ""}`}>
                                    <span>{`${conv.sentBy}:`}</span>
                                    <span>{conv.lastMessage}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center h-full text-base m:text-lg text-gray-500">
                        No conversations found.
                    </div>
                )
            ) : (
                <ChatsLoader/>
            )}
        </>
    )
};

export default ChatsBar