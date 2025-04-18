import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
    deleteConversation,
    getConversationOnInitial,
    sendMessage
} from "../../../../../ApiCalls/Services/MessageService.ts";
import {BadRequestError, NotFoundError, PayloadTooLarge} from "../../../../../ApiCalls/Errors/CustomErrors.ts";
import ChatsLoader from "../../../../../Additional/Loading/ChatsLoader.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faCircleUser, faComments, faUser} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserUtil} from "../../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useMessages} from "../../../../../GlobalProviders/Messages/useMessages.ts";
import {Sent} from "../Messages.tsx";

interface ChatWindowProps {
    setSent: React.Dispatch<React.SetStateAction<Sent>>;
    setDeleted: React.Dispatch<React.SetStateAction<string>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ setSent, setDeleted }) => {
    interface UserInfo {
        username: string;
        profilePic: string;
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
    const [interactionButton, setInteractionButton] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const componentRef1 = useRef<HTMLDivElement | null>(null);
    const [deleteDecision, setDeleteDecision] = useState<boolean>(false);
    const [blockDecision, setBlockDecision] = useState<boolean>(false);

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
                        senderUsername: message.senderUsername ?? "",
                        content: message.content ?? "",
                        timestamp: message.timestamp ?? "",
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
                    console.error("User or conversation not found: ", error);
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
                timestamp: new Date().toLocaleString(),
            };
            setMessages(prev => [messageToAdd, ...prev]);
        }
    }, [notification]); //adds notification message to chat

    const handleSendMessage = async () => {
        if (disabled || username === "" || content.trim() === "") return;
        if (receiverUsername === "") {
            setUserInfo({ username: "", profilePic: "" });
            setMessages([]);
            return;
        }
        if (content.length > 1000) return;
        setDisabled(true);
        const messageToSend = {senderUsername: username, receiverUsername: receiverUsername, content: content};
        try {
            await sendMessage(messageToSend);
            const messageToAdd: Message = {
                senderUsername: messageToSend.senderUsername,
                content: messageToSend.content,
                timestamp: new Date().toLocaleString(),
            };
            setMessages(prev => [messageToAdd, ...prev,]);
            const messageToChange: Sent = {
                username: messageToSend.receiverUsername,
                lastMessage: messageToSend.content,
                timestamp: new Date().toLocaleString(),
                sentBy: messageToSend.senderUsername,
            }
            setSent(messageToChange);
            setContent("");
        } catch (error: unknown) {
            navigate("/details/messages");
            if (error instanceof NotFoundError) {
                console.error("Message receiver not found: ", error);
            } else if (error instanceof PayloadTooLarge) {
                console.error("Message is too long: ", error);
            } else if (error instanceof BadRequestError) {
                console.error("You cannot send message: ", error);
            } else {
                console.error("Unexpected error when sending message: ", error);
            }
        } finally {
            setTimeout(() => setDisabled(false), 500);
        }
    }; //sending message

    useEffect(() => {
        const container = messageContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    }, [messages]);  //bottom-oriented

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
            if ((deleteDecision || blockDecision) && componentRef1.current && !componentRef1.current.contains(event.target as Node)) {
                setDeleteDecision(false);
                setBlockDecision(false);
            }
        }
        if (deleteDecision || blockDecision) {
            document.addEventListener("mousedown", handleClickOutside1);
            document.addEventListener("touchstart", handleClickOutside1);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside1);
            document.removeEventListener("touchstart", handleClickOutside1);
        }
    }, [deleteDecision, blockDecision]) //offs delete/block decision window

    const handleDeleteConversation = async () => {
        if (disabled) return;
        setDisabled(true);
        try {
            await deleteConversation(receiverUsername);
            navigate("/details/messages");
            setUserInfo({ username: "", profilePic: "" });
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

    const handleBlockUser = () => {
        console.log("user blocked")
        setBlockDecision(false);
    };

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
                                    <div className="flex flex-col justify-center items-center w-[90px] h-[53px] m:h-[57px] shadow text-xs m:text-sm
                                    divide-y bg-coolRed text-white absolute -bottom-[11px] m:-bottom-[12px] -left-[104px]">
                                        <button className={`w-full h-1/2 ${!isMobile && "hover:text-lowBlack"}`}
                                                onClick={() => setDeleteDecision(true)}>
                                            Delete chat
                                        </button>
                                        <button className={`w-full h-1/2 ${!isMobile && "hover:text-lowBlack"}`}
                                                onClick={() => setBlockDecision(true)}>
                                            Block user
                                        </button>
                                    </div>}
                            </div>
                        </div>
                        <div className="flex flex-col-reverse w-full h-full pt-2 pb-5 px-0.5 overflow-auto overscroll-contain"
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
                        <div className="flex flex-row items-center w-full h-11 m:h-12 text-lg m:text-xl border-t-2 border-gray-300 shadow-top-l relative">
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
                            {content.length > 1000 &&
                                <p className="absolute -bottom-[19px] m:-bottom-[22px] -left-[2px] p-[1px] rounded-sm text-xs m:text-sm bg-coolRed text-white">
                                    Message is too long!
                                </p>}
                        </div>
                        {(deleteDecision || blockDecision) &&
                            <div className="flex justify-center items-center fixed inset-0 w-full h-full bg-black bg-opacity-40 z-50">
                                <div className="flex flex-col items-center justify-center w-full max-w-[600px] text-white
                                text-lg m:text-xl px-3 border-2 border-gray-300 rounded-sm bg-coolRed"
                                     ref={componentRef1}>
                                    <p className="text-center mt-12">
                                        {`Are you sure you want to ${deleteDecision ? " delete this conversation?" : "block this user?"}`}
                                    </p>
                                    <div className="flex flex-row gap-14 m:gap-20 mt-8 mb-12">
                                        <button className={`w-[72px] m:w-20 h-9 m:h-10 border rounded-sm shadow
                                        ${!isMobile && "hover:text-black hover:bg-white hover:border-black"}`}
                                                onClick={deleteDecision ? handleDeleteConversation : handleBlockUser}>
                                            Yes
                                        </button>
                                        <button className={`w-[72px] m:w-20 h-9 m:h-10 border rounded-sm shadow
                                        ${!isMobile && "hover:text-black hover:bg-white hover:border-black"}`}
                                                onClick={deleteDecision ? () => setDeleteDecision(false) : () => setBlockDecision(false)}>
                                            No
                                        </button>
                                    </div>
                                    <FontAwesomeIcon icon={deleteDecision ? faComments : faUser} className="absolute inset-0 m-auto text-xl m:text-2xl"/>
                                </div>
                            </div>}
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