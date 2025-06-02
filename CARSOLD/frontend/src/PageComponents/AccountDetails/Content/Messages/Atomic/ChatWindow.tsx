import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {blockUnblockUser, deleteConversation, getConversationOnInitial, getPreviousMessages, sendMessage} from "../../../../../ApiCalls/Services/MessageService.ts";
import {BadRequestError, NotFoundError, PayloadTooLargeError} from "../../../../../ApiCalls/Errors/CustomErrors.ts";
import ChatsLoader from "../../../../../Additional/Loading/ChatsLoader.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUp, faCheck, faCircleInfo, faCircleUser, faComments, faUser} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserUtil} from "../../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useMessages} from "../../../../../GlobalProviders/Messages/useMessages.ts";
import {Sent} from "../Messages.tsx";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

export interface MessageDto {
    receiverUsername: string;
    content: string;
}
interface ChatWindowProps {
    setSent: React.Dispatch<React.SetStateAction<Sent>>;
    setDeleted: React.Dispatch<React.SetStateAction<string>>;
    setMarkSeen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ setSent, setDeleted, setMarkSeen }) => {
    interface UserInfo {
        username: string;
        profilePic: string;
        blockedByUser: boolean;
        blockedUser: boolean;
        seenByUser: boolean;
    }
    interface Message {
        senderUsername: string;
        content: string;
        timestamp: string;
    }
    const [searchParams] = useSearchParams();
    const receiverUsername: string = searchParams.get("username") ?? "";
    const [userInfo, setUserInfo] = useState<UserInfo>({
        username: "",
        profilePic: "",
        blockedByUser: false,
        blockedUser: false,
        seenByUser: false,
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [fetched, setFetched] = useState<boolean>(true);
    const [imageError, setImageError] = useState<boolean>(false);
    const {buttonColor, bindHoverHandlers} = useButton();
    const {isMobile} = useUtil();
    const navigate = useNavigate();
    const {username} = useUserUtil();
    const [content, setContent] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const {notification} = useMessages();
    const [interactionButton, setInteractionButton] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const componentRef1 = useRef<HTMLDivElement | null>(null);
    const [deleteDecision, setDeleteDecision] = useState<boolean>(false);
    const [blockUnblockDecision, setBlockUnblockDecision] = useState<boolean>(false);
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const {isAuthenticated} = useAuth();
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasScrolled, setHasScrolled] = useState<boolean>(false);
    const [initial, setInitial] = useState<boolean>(false);
    const [msgAdded, setMsgAdded] = useState<boolean>(false);
    const {t} = useLanguage();

    useEffect(() => {
        const handleGetConversationOnInitial = async () => {
            if (!receiverUsername) return;
            setFetched(false);
            try {
                const convWithUser = await getConversationOnInitial(receiverUsername);
                if (convWithUser.data) {
                    const formattedUserInfo: UserInfo = {
                        username: convWithUser.data.username ?? "",
                        profilePic: convWithUser.data.profilePic ?? "",
                        blockedByUser: convWithUser.data.blockedByUser ?? false,
                        blockedUser: convWithUser.data.blockedUser ?? false,
                        seenByUser: convWithUser.data.seenByUser ?? false,
                    };
                    const pagedMessages = convWithUser.data.messages;
                    const formattedMessages = (pagedMessages?.messages ?? []).map((message: Message) => ({
                        senderUsername: message.senderUsername ?? "",
                        content: message.content ?? "",
                        timestamp: message.timestamp ?? "",
                    }));
                    setUserInfo(formattedUserInfo);
                    setMessages(formattedMessages);
                    setHasMore(pagedMessages?.hasMore ?? false);
                    setInitial(true);
                    setPage(0);
                }
            } catch (error: unknown) {
                navigate("/details/messages");
                setUserInfo({username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false});
                setMessages([]);
                setHasMore(false);
                if (error instanceof BadRequestError) {
                    console.error("Cannot display conversation: ", error);
                } else if (error instanceof NotFoundError) {
                    console.error("User or conversation not found: ", error);
                } else {
                    console.error("Unexpected error when fetching conversation: ", error);
                }
            } finally {
                setFetched(true);
            }
        };
        if (receiverUsername) handleGetConversationOnInitial();
    }, [receiverUsername]);  //fetching chosen conversation on initial

    useEffect(() => {
        if (notification.senderUsername === receiverUsername) {
            const messageToAdd: Message = {
                senderUsername: notification.senderUsername,
                content: notification.content,
                timestamp: new Date().toLocaleString(),
            };
            setMessages(prev => [...prev, messageToAdd]);
            setMsgAdded(true);
        }
    }, [notification]); //adds notification message to chat

    const handleSendMessage = async () => {
        if (disabled || username === "" || content.trim() === "") return;
        if (receiverUsername === "") {
            setUserInfo({ username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false });
            setMessages([]);
            return;
        }
        if (content.length > 1000) return;
        if (userInfo.blockedByUser || userInfo.blockedUser) return;
        setDisabled(true);
        const messageToSend: MessageDto = {receiverUsername: receiverUsername, content: content};
        try {
            await sendMessage(messageToSend);
            const messageToAdd: Message = {
                senderUsername: username,
                content: messageToSend.content,
                timestamp: new Date().toLocaleString(),
            };
            setMessages(prev => [...prev, messageToAdd]);
            const messageToChange: Sent = {
                username: messageToSend.receiverUsername,
                lastMessage: messageToSend.content,
                timestamp: new Date().toLocaleString(),
                sentBy: username
            }
            setUserInfo(prev => ({...prev, seenByUser: false}));
            setSent(messageToChange);
            setContent("");
            setMsgAdded(true);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                navigate("/details/messages");
                setUserInfo({ username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false });
                setMessages([]);
                console.error("Message receiver not found: ", error);
            } else if (error instanceof BadRequestError) {
                navigate("/details/messages");
                setUserInfo({ username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false });
                setMessages([]);
                console.error("You cannot send message: ", error);
            } else if (error instanceof PayloadTooLargeError) {
                console.error("Message is too long: ", error);
            } else {
                console.error("Unexpected error when sending message: ", error);
            }
        } finally {
            setTimeout(() => setDisabled(false), 100);
        }
    }; //sending message

    useEffect(() => {
        const timeout = setTimeout(() => {
            const container = messageContainerRef.current;
            if (container) container.scrollTop = container.scrollHeight;
            if (msgAdded) setMsgAdded(false);
            if (initial) setInitial(false);
        }, 0);

        return () => clearTimeout(timeout);
    }, [initial, msgAdded, receiverUsername]);  //orients container on bottom

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (interactionButton && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setInteractionButton(false);
            }
        }
        if (interactionButton) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [interactionButton]) //offs interactionButton dropdown

    useEffect(() => {
        const handleClickOutside1 = (event: MouseEvent | TouchEvent) => {
            if ((deleteDecision || blockUnblockDecision) && componentRef1.current && !componentRef1.current.contains(event.target as Node)) {
                setDeleteDecision(false);
                setBlockUnblockDecision(false);
            }
        }
        if (deleteDecision || blockUnblockDecision) {
            document.addEventListener("mousedown", handleClickOutside1);
            document.addEventListener("touchstart", handleClickOutside1);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside1);
            document.removeEventListener("touchstart", handleClickOutside1);
        }
    }, [deleteDecision, blockUnblockDecision]) //offs delete/block decision window

    const handleDeleteConversation = async () => {
        if (disabled) return;
        setDisabled(true);
        try {
            await deleteConversation(receiverUsername);
            navigate("/details/messages");
            setUserInfo({ username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false });
            setMessages([]);
            setDeleted(receiverUsername);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                console.error("User or conversation not found: ", error);
            } else {
                console.error("Unexpected error when deleting conversation: ", error);
            }
        } finally {
            setDisabled(false);
            setDeleteDecision(false);
        }
    };

    const handleBlockUnblockUser = async () => {
        if (disabled) return;
        setDisabled(true);
        try {
            await blockUnblockUser(receiverUsername);
            setUserInfo(prev => ({
                ...prev,
                blockedByUser: !userInfo.blockedByUser
            }));
        } catch (error) {
            navigate("/details/messages");
            setUserInfo({ username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false });
            setMessages([]);
            if (error instanceof NotFoundError) {
                console.error("User or conversation not found: ", error);
            } else {
                console.error("Unexpected error when blocking user: ", error);
            }
        } finally {
            setDisabled(false);
            setBlockUnblockDecision(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated || !username || !receiverUsername) return;
        const socketUrl = import.meta.env.VITE_BACKEND_URL.startsWith("https://")
            ? `${import.meta.env.VITE_BACKEND_URL.replace(/^http:/, 'https:')}/ws`
            : `${import.meta.env.VITE_BACKEND_URL}/ws`;
        const socket = new SockJS(socketUrl);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {};

        const topic = [username, receiverUsername].sort().join("-");
        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/seen/${topic}`, (message) => {
                try {
                    const parsed = JSON.parse(message.body);
                    setUserInfo(prev => ({...prev, seenByUser: parsed}))
                } catch (error) {
                    console.error("Failed to parse seen status:", error);
                }
            });
            stompClientRef.current = stompClient;
        }, () => {});

        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.disconnect(() => {
                    //console.log("🧹 Disconnected from seen status WebSocket");
                });
            }
        };
    }, [username, receiverUsername, isAuthenticated]);  //WebSocket which updates if message was seen

    const handleScroll = () => {
        const container = messageContainerRef.current;
        if (container && container.scrollTop === 0 && !isLoadingMore && hasMore) {
            setHasScrolled(true);
        }
    };  //detects when user scrolls up

    useEffect(() => {
        const container = messageContainerRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll);

        return () => container.removeEventListener("scroll", handleScroll);
    }, []);  //adds event listener to detect scroll up

    useEffect(() => {
        if (!hasScrolled || !receiverUsername || !hasMore || isLoadingMore) return;
        const handleGetOlderMessages = async () => {
            setIsLoadingMore(true);
            setTimeout(async () => {
            try {
                const pagedMessages = await getPreviousMessages(receiverUsername, page + 1);
                if (pagedMessages.data?.messages.length > 0) {
                    const container = messageContainerRef.current;
                    const prevScrollHeight = container?.scrollHeight ?? 0;

                    const formattedMessages = pagedMessages.data.messages.map((message: Message) => ({
                        senderUsername: message.senderUsername ?? "",
                        content: message.content ?? "",
                        timestamp: message.timestamp ?? "",
                    }));

                    setMessages(prev => [...formattedMessages, ...prev,]);
                    setPage(prev => prev + 1);
                    setHasMore(pagedMessages.data.hasMore);

                    requestAnimationFrame(() => {
                        if (container) {
                            const offset = 3;
                            container.scrollTop = container.scrollHeight - prevScrollHeight + offset;
                        }});
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                navigate("/details/messages");
                setUserInfo({username: "", profilePic: "", blockedByUser: false, blockedUser: false, seenByUser: false});
                setMessages([]);
                setHasMore(false);
                if (error instanceof BadRequestError) {
                    console.error("Cannot load more messages: ", error);
                } else if (error instanceof NotFoundError) {
                    console.error("User or conversation not found: ", error);
                } else {
                    console.error("Unexpected error when loading more messages: ", error);
                }
            } finally {
                setIsLoadingMore(false);
                setHasScrolled(false);
            }
            }, 50);
        };
        if (receiverUsername) handleGetOlderMessages();
    }, [hasScrolled]);  //fetches older messages when user scrolls up

    return (
        <>
            {fetched ?
                userInfo.username ?
                    <div className="flex flex-col w-full h-full border-2 border-gray-300 rounded-sm">
                        <div className="flex flex-row items-center w-full py-1 px-3 border-b-2 border-gray-300 rounded-sm shadow-bottom-l">
                            <div className="flex flex-row items-center w-full gap-4">
                                {userInfo.profilePic !== "" && !imageError ?
                                    <img src={userInfo.profilePic} alt="Img" onError={() => setImageError(true)}
                                         className="w-11 h-11 m:w-12 m:h-12 rounded-full object-cover border border-gray-500"/>
                                    : <FontAwesomeIcon icon={faCircleUser} className="w-11 h-11 m:w-12 m:h-12"/>}
                                <span className="text-[22px] m:text-2xl font-semibold text-gray-500">{userInfo.username}</span>
                            </div>
                            <div className="relative" ref={componentRef}>
                                <button className={`pt-1 px-1 ${!isMobile && "hover:scale-[110%]"}`} onClick={() => setInteractionButton(prev => !prev)}>
                                    <FontAwesomeIcon className="text-2xl m:text-[26px] text-gray-500" icon={faCircleInfo}/>
                                </button>
                                {interactionButton &&
                                    <div className="flex flex-col justify-center items-center w-[90px] h-[53px] m:h-[57px] text-xs m:text-sm
                                    divide-y text-white absolute -bottom-[11px] m:-bottom-[12px] -left-[104px]">
                                        <button className={`w-full h-1/2 bg-coolRed ${!isMobile && "hover:text-lowBlack"}`}
                                                onClick={() => setDeleteDecision(true)}>
                                            {t("chatWindow1")}
                                        </button>
                                        <button className={`w-full h-1/2 ${userInfo.blockedByUser ? "bg-green-400" : "bg-coolRed"}
                                        ${!isMobile && "hover:text-lowBlack"}`}
                                                onClick={() => setBlockUnblockDecision(true)}>
                                            {userInfo.blockedByUser ? t("chatWindow3") : t("chatWindow2")}
                                        </button>
                                    </div>}
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-full pt-2 pb-4 px-0.5 overflow-auto overscroll-contain relative"
                             ref={messageContainerRef} onScroll={handleScroll}>
                            {isLoadingMore &&
                                <div className="flex justify-center items-center w-full sticky top-0 z-10 text-xs m:text-sm">
                                    <span className="border border-gray-500 rounded px-1 bg-white shadow">{t("chatWindow4")}</span>
                                </div>}
                            {messages.map((message, index) => {
                                const isOwn = message.senderUsername === username;
                                const isLast = index === messages.length - 1;
                                const isSeen = isLast && isOwn && userInfo.seenByUser;
                                const isSent = isLast && isOwn && !userInfo.seenByUser;
                                return (
                                    <div key={index} className={`flex flex-row w-full p-1 m:p-1.5 relative
                                    ${isOwn ? "justify-end" : "justify-start"}`}>
                                        <div className={`text-base m:text-lg p-1.5 m:p-2 rounded-lg max-w-[49%] break-words
                                        ${isOwn ? "bg-gray-400" : "bg-gray-300"}`} title={new Date(message.timestamp).toLocaleString()}>
                                            {message.content}
                                            {(isSent || isSeen) &&
                                                <div className="flex flex-row justify-center items-center text-xs m:text-sm
                                                absolute -bottom-3.5 right-2 gap-0.5">
                                                    <FontAwesomeIcon icon={isSent ? faArrowUp : faCheck}/>
                                                    <span>{isSent ? t("chatWindow5") : t("chatWindow6")}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                            {messages.length === 0 && (
                                <div className="flex justify-center items-center h-full text-base m:text-lg text-gray-500">
                                    {t("chatWindow7")}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row items-center w-full h-11 m:h-12 text-lg m:text-xl border-t-2 border-gray-300 shadow-top-l relative">
                            <input className="w-[75%] h-full outline-none px-2" placeholder={t("chatWindow8")} onFocus={() => setMarkSeen(true)} onBlur={() => setMarkSeen(false)}
                                   value={content} onChange={(e) => setContent(e.target.value)} disabled={userInfo.blockedByUser || userInfo.blockedUser}
                                   onKeyDown={e => e.key === "Enter" && handleSendMessage()}/>
                            {(userInfo.blockedByUser || userInfo.blockedUser) &&
                                <div className="flex justify-center items-center truncate absolute top-0 left-0 w-[75%] h-full bg-coolRed text-white text-center"
                                     onMouseDown={!isMobile ? () => setMarkSeen(true) : undefined}
                                     onMouseUp={!isMobile ? () => setMarkSeen(false) : undefined}
                                     onTouchStart={isMobile ? () => setMarkSeen(true) : undefined}
                                     onTouchEnd={isMobile ? () => setMarkSeen(false) : undefined}>
                                    {userInfo.blockedByUser ? t("chatWindow9") : `${t("chatWindow10")} ${userInfo.username}`}
                                </div>}
                            <button className={`w-[25%] h-full border-l-2 border-gray-300
                            bg-lime ${buttonColor ? "brightness-95 text-gray-800" : "text-gray-500"}`}
                                    disabled={userInfo.blockedByUser || userInfo.blockedUser}
                                    onClick={handleSendMessage}  {...bindHoverHandlers()}>
                                {t("chatWindow11")}
                            </button>
                            {content.length > 1000 &&
                                <p className="absolute -bottom-[19px] m:-bottom-[22px] -left-[2px] p-[1px] rounded-sm text-xs m:text-sm bg-coolRed text-white">
                                    {t("chatWindow12")}
                                </p>}
                        </div>
                        {(deleteDecision || blockUnblockDecision) &&
                            <div className="flex justify-center items-center fixed inset-0 w-full h-full bg-black bg-opacity-40 z-50">
                                <div className={`flex flex-col items-center justify-center w-full max-w-[600px] text-white text-lg m:text-xl px-3 border-2 border-gray-300 rounded-sm 
                                ${userInfo.blockedByUser && blockUnblockDecision ? "bg-green-400" : "bg-coolRed"}`}
                                     ref={componentRef1}>
                                    <p className="text-center mt-12">
                                        {`${t("chatWindow13")} ${deleteDecision ? ` ${t("chatWindow14")}` : `${userInfo.blockedByUser ? t("chatWindow15") : t("chatWindow16")} ${t("chatWindow17")}`}`}
                                    </p>
                                    <div className="flex flex-row gap-14 m:gap-20 mt-8 mb-12">
                                        <button className={`w-[72px] m:w-20 h-9 m:h-10 border rounded-sm shadow
                                        ${!isMobile && "hover:text-black hover:bg-white hover:border-black"}`}
                                                onClick={deleteDecision ? handleDeleteConversation : handleBlockUnblockUser}>
                                            {t("chatWindow18")}
                                        </button>
                                        <button className={`w-[72px] m:w-20 h-9 m:h-10 border rounded-sm shadow
                                        ${!isMobile && "hover:text-black hover:bg-white hover:border-black"}`}
                                                onClick={deleteDecision ? () => setDeleteDecision(false) : () => setBlockUnblockDecision(false)}>
                                            {t("chatWindow19")}
                                        </button>
                                    </div>
                                    <FontAwesomeIcon icon={deleteDecision ? faComments : faUser} className="absolute inset-0 m-auto text-xl m:text-2xl"/>
                                </div>
                            </div>}
                    </div>
                    : <div className="flex justify-center items-center h-full text-base m:text-lg text-gray-500">
                        {t("chatWindow20")}
                    </div>
                : <ChatsLoader/>
            }
        </>
    )
};

export default ChatWindow