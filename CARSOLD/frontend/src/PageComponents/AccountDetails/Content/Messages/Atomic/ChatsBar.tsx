import React, {useEffect, useState} from "react";
import {useMessages} from "../../../../../GlobalProviders/Messages/useMessages.ts";
import {getAllConversations, makeSeen} from "../../../../../ApiCalls/Services/MessageService.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import ChatsLoader from "../../../../../Additional/Loading/ChatsLoader.tsx";
import {Link, useSearchParams} from "react-router-dom";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {Sent} from "../Messages.tsx";
import {NotFoundError} from "../../../../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

interface ChatsBarProps {
    sent: Sent;
    deleted: string;
    setDeleted: React.Dispatch<React.SetStateAction<string>>;
    markSeen: boolean;
}

const ChatsBar: React.FC<ChatsBarProps> = ({sent, deleted, setDeleted, markSeen}) => {
    interface Conversation {
        username: string;
        profilePic: string;
        lastMessage: string;
        timestamp: string;
        sentBy: string;
        seen: boolean;
    }

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const {notification} = useMessages();
    const [imageError, setImageError] = useState<boolean>(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const {isMobile} = useUtil();
    const [searchParams] = useSearchParams();
    const receiverUsername: string = searchParams.get("username") ?? "";
    const {unseenMessagesCount, setUnseenMessagesCount} = useMessages();
    const {t} = useLanguage();

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
                        seen: conv.seen ?? true,
                    }));
                    setConversations(formattedConversations);
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
                            seen: false,
                        } : conv
                )
            );
        } else {
            const newConv = {
                username: notification.senderUsername ?? "",
                profilePic: notification.senderProfilePic ?? "",
                lastMessage: notification.content ?? "",
                sentBy: notification.senderUsername ?? "",
                timestamp: notification.timestamp ?? "",
                seen: false,
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
                            seen: true,
                        } : conv
                )
            );
        }
    }, [sent]); //updates conversation first message, timestamp and sender, based on sent message

    useEffect(() => {
        if (!deleted) return;
        setConversations(prev =>
            prev.filter(conv => conv.username !== deleted)
        );
        setDeleted("");
    }, [deleted]); //updates conversations, when conversation is deleted

    useEffect(() => {
        if (!markSeen) return;
        const foundConv = conversations.find(conv => conv.username === receiverUsername);
        if (!foundConv || foundConv.seen) return;
        const handleMakeSeen = async () => {
            try {
                await makeSeen(receiverUsername);
                if (conversations.some(conv => conv.username === receiverUsername)) {
                    setConversations(prev =>
                        prev.map(conv =>
                            conv.username === receiverUsername
                                ? {
                                    ...conv,
                                    seen: true,
                                } : conv
                        )
                    );
                    if (unseenMessagesCount > 0) {
                        setUnseenMessagesCount(prev => prev - 1);
                    }
                }
            } catch (error: unknown) {
                if (error instanceof NotFoundError) {
                    console.error("Conversation or user not found while setting message as seen: ", error);
                } else {
                    console.error("Unexpected error occurred while setting message as seen");
                }
            }
        };
        handleMakeSeen();
    }, [markSeen]); //makes conversation seen

    return (
        <>
            {fetched ? (
                conversations.length > 0 ? (
                    <ul className="w-full list-none">
                        {conversations.map((conv, index) => (
                            <li key={index}>
                                <Link className={`flex flex-row items-center w-full p-2 gap-2 border rounded-sm
                                border-gray-300 cursor-pointer ${hovered === index && "scale-[101%] shadow-bottom"}`}
                                      to={`/details/messages?username=${conv.username}`}
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
                                        <div
                                            className={`flex flex-row items-center gap-0.5 m:gap-1 text-xs m:text-sm text-gray-700`}>
                                            {conv.sentBy && conv.lastMessage ?
                                                <span
                                                    className={`${!conv.seen && "font-semibold"} truncate`}>{`${conv.sentBy}: ${conv.lastMessage}`}</span>
                                                : <span>{t("chatsBar2")}</span>
                                            }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex justify-center items-center h-full text-base m:text-lg text-gray-500">
                        {t("chatsBar1")}
                    </div>
                )
            ) : (
                <ChatsLoader/>
            )}
        </>
    )
};

export default ChatsBar