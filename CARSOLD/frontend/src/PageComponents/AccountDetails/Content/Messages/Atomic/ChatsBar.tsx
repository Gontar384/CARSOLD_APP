import React, {useEffect, useState} from "react";
import {useMessages} from "../../../../../GlobalProviders/Messages/useMessages.ts";
import {getAllConversations} from "../../../../../ApiCalls/Services/MessageService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import ChatsLoader from "../../../../../Additional/Loading/ChatsLoader.tsx";
import {useNavigate} from "react-router-dom";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {Sent} from "../Messages.tsx";

interface ChatsBarProps {
    sent: Sent;
}

const ChatsBar: React.FC<ChatsBarProps> = ({sent}) => {
    interface Conversation {
        username: string;
        profilePic: string;
        lastMessage: string;
        timestamp: string;
        sentBy: string;
    }
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const {notification} = useMessages();
    const [imageError, setImageError] = useState<boolean>(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const navigate = useNavigate();
    const {isMobile} = useUtil();

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
                setFetched(true);
            }
        };
        handleGetAllConversations();
    }, []); //fetching all conversations on initial

    useEffect(() => {
        if (!notification || !notification.senderUsername) return;
        const exists = conversations.some(conv => conv.username === notification.senderUsername);
        if (exists) {
            setConversations(prev =>
                prev.map(conv =>
                    conv.username === notification.senderUsername
                        ? {
                            ...conv,
                            lastMessage: notification.content ?? "",
                            sentBy: notification.senderUsername ?? "",
                            timestamp: notification.timestamp ?? "",
                            seen: notification.seen ?? "",
                        } : conv
                )
            );
        } else {
            const newConv = {
                username: notification.senderUsername ?? "",
                profilePic: notification.senderProfilePic ?? "",
                lastMessage: notification.content ?? "",
                sentBy: notification.senderUsername ?? "",
                seen: notification.seen ?? "",
                timestamp: notification.timestamp ?? "",
            };
            setConversations(prev => [newConv, ...prev]);
        }
    }, [notification]); //updates conversation first message, based on notification

    useEffect(() => {
        if (!sent || !sent.username) return;
        const exists = conversations.some(conv => conv.username === sent.username);
        if (exists) {
            setConversations(prev =>
                prev.map(conv =>
                    conv.username === sent.username
                        ? {
                            ...conv,
                            lastMessage: sent.lastMessage ?? "",
                            timestamp: sent.timestamp ?? "",
                            sentBy: sent.sentBy ?? "",
                        } : conv
                )
            );
        }
    }, [sent]); //updates conversation first message, based on sent message

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
                                    {conv.timestamp &&
                                        <span className="text-[10px] m:text-xs text-gray-500">
                                            {new Date(conv.timestamp).toLocaleString()}
                                        </span>}
                                </div>
                                <div className={`flex flex-row items-center gap-0.5 m:gap-1 text-xs m:text-sm
                                text-gray-700`}>
                                    {conv.sentBy && conv.lastMessage ?
                                        <>
                                            <span>{`${conv.sentBy}:`}</span>
                                            <span>{conv.lastMessage}</span>
                                        </>
                                        : <span>No messages yet.</span>
                                    }
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