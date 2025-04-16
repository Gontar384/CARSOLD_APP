import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getConversationOnInitial, sendMessage} from "../../../../../ApiCalls/Services/MessageService.ts";
import {BadRequestError, NotFoundError, PayloadTooLarge} from "../../../../../ApiCalls/Errors/CustomErrors.ts";
import ChatsLoader from "../../../../../Additional/Loading/ChatsLoader.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserUtil} from "../../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useMessages} from "../../../../../GlobalProviders/Messages/useMessages.ts";
import {Conversation} from "./ChatsBar.tsx";

interface ChatWindowProps {
    setSent: React.Dispatch<React.SetStateAction<Conversation>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ setSent }) => {
    interface UserInfo {
        username: string;
        profilePic: string;
    }
    interface Message {
        content: string;
        seen: boolean;
        timestamp: string;
        senderUsername: string;
    }
    const [searchParams] = useSearchParams();
    const receiverUsername: string = searchParams.get("username") ?? "";
    const [userInfo, setUserInfo] = useState<UserInfo>({
        username: "",
        profilePic: "",
    });
    const [messages, setMessages] = useState<Message[]>([]);
    const [fetched, setFetched] = useState<boolean>(true);
    const [imageError, setImageError] = useState<boolean>(false);
    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();
    const navigate = useNavigate();
    const {username} = useUserUtil();
    const [content, setContent] = useState<string>("");
    const [disabled, setDisabled] = useState<boolean>(false);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const {notification} = useMessages();

    useEffect(() => {
        const handleGetConversationOnInitial = async (username: string | null) => {
            if (!username) return;
            setFetched(false);
            try {
                const convWithUser = await getConversationOnInitial(username);
                if (convWithUser.data) {
                    const formattedUserInfo: UserInfo = {
                        username: convWithUser.data.username ?? "",
                        profilePic: convWithUser.data.profilePic ?? ""
                    };
                    const formattedMessages = convWithUser.data.messages.map((message: Message) => ({
                        content: message.content ?? "",
                        seen: message.seen ?? false,
                        timestamp: message.timestamp ?? "",
                        senderUsername: message.senderUsername ?? "",
                    }));
                    setUserInfo(formattedUserInfo);
                    setMessages(formattedMessages);
                }
            } catch (error: unknown) {
                navigate("/details/messages");
                setUserInfo({username: "", profilePic: ""});
                if (error instanceof BadRequestError) {
                    console.error("Cannot display conversation: ", error);
                } else if (error instanceof NotFoundError) {
                    console.error("User not found: ", error);
                } else {
                    console.error("Unexpected error when fetching conversation: ", error);
                }
            } finally {
                setFetched(true);
            }
        };
        if (receiverUsername) handleGetConversationOnInitial(receiverUsername);
    }, [receiverUsername]);  //fetching chosen conversation on initial

    useEffect(() => {
        if (notification.senderUsername === receiverUsername) {
            const messageToAdd: Message = {
                senderUsername: notification.senderUsername,
                content: notification.content,
                seen: false,
                timestamp: new Date().toLocaleString(),
            };
            setMessages(prev => [...prev, messageToAdd]);
        }
    }, [notification]); //adds notification message to chat

    const handleSendMessage = async () => {
        if (disabled || username === "" || receiverUsername === "" || content.trim() === "") return;
        setDisabled(true);
        const messageToSend = {senderUsername: username, receiverUsername: receiverUsername, content: content};
        try {
            await sendMessage(messageToSend);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                console.error("Message receiver not found: ", error);
            } else if (error instanceof PayloadTooLarge) {
                console.error("Message is too long: ", error);
            } else {
                console.error("Unexpected error when sending message: ", error);
            }
        } finally {
            const messageToAdd: Message = {
                senderUsername: messageToSend.senderUsername,
                content: messageToSend.content,
                seen: false,
                timestamp: new Date().toLocaleString(),
            };
            setMessages(prev => [...prev, messageToAdd]);
            const messageToChange: Conversation = {
                username: messageToSend.receiverUsername,
                profilePic: "",
                lastMessage: messageToSend.content,
                timestamp: new Date().toLocaleString(),
                seen: false,
                sentBy: messageToSend.senderUsername,
            }
            setSent(messageToChange);
            setContent("");
            setTimeout(() => setDisabled(false), 500);
        }
    }; //sending message

    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);  //bottom-oriented

    return (
        <>
            {fetched ?
                userInfo.username ?
                    <div className="flex flex-col items-center w-full h-full border-2 border-gray-300 rounded-sm">
                        <div className="flex flex-row w-full py-1 px-3 border-b-2 border-gray-300 rounded-sm shadow-bottom-l">
                            <div className="flex flex-row items-center w-full gap-4">
                                {userInfo.profilePic !== "" && !imageError ?
                                    <img src={userInfo.profilePic} alt="Img" onError={() => setImageError(true)}
                                         className="w-11 h-11 m:w-12 m:h-12 rounded-full object-cover border border-gray-500"/>
                                    : <FontAwesomeIcon icon={faCircleUser} className="w-11 h-11 m:w-12 m:h-12"/>}
                                <span className="text-[22px] m:text-2xl font-semibold text-gray-500">{userInfo.username}</span>
                            </div>
                            <button className="flex flex-row items-center">
                                <FontAwesomeIcon className="text-2xl m:text-[26px] text-gray-500" icon={faCircleInfo}/>
                            </button>
                        </div>
                        <div className="w-full h-full pt-2 pb-5 overflow-auto overscroll-contain"
                             ref={messageContainerRef}>
                            {messages.map((message, index) => (
                                <div key={index} className={`flex flex-row w-full p-1 m:p-1.5
                                ${message.senderUsername === username ? "justify-end" : "justify-start"}`}>
                                    <div className={`text-base m:text-lg p-1 m:p-1.5 rounded-lg max-w-[49%] break-words
                                    ${message.senderUsername === username ? "bg-gray-400" : "bg-gray-300"}`}>
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <div className="flex justify-center items-center h-full text-base m:text-lg text-gray-500">
                                    No messages yet.
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row items-center w-full h-11 m:h-12 text-lg m:text-xl border-t-2 border-gray-300 shadow-top-l">
                            <input className="w-[75%] h-full outline-none px-2" placeholder="Type in..."
                                   value={content} onChange={(e) => setContent(e.target.value)}/>
                            <button className={`w-[25%] h-full border-l-2 border-gray-300
                            bg-lime ${buttonColor ? "brightness-95 text-gray-800" : "text-gray-500"}`}
                                    onClick={handleSendMessage}
                                    onMouseEnter={!isMobile ? handleStart : undefined}
                                    onMouseLeave={!isMobile ? handleEnd : undefined}
                                    onTouchStart={isMobile ? handleStart : undefined}
                                    onTouchEnd={isMobile ? handleEnd : undefined}>
                                Send
                            </button>
                        </div>
                    </div>
                    : <div className="flex justify-center items-center h-full text-base m:text-lg text-gray-500">
                        Choose conversation to display.
                    </div>
                : <ChatsLoader/>
            }
        </>
    )
};

export default ChatWindow