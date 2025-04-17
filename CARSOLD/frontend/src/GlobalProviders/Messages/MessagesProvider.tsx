import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { MessagesContext } from "./useMessages";
import {useUserUtil} from "../UserUtil/useUserUtil.ts";
import {useAuth} from "../Auth/useAuth.ts";
import {getUnseenCount} from "../../ApiCalls/Services/MessageService.ts";

export interface Notification {
    senderUsername: string;
    senderProfilePic: string;
    content: string;
    timestamp: string;
    seen: boolean;
}

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification>({
        senderUsername: "",
        senderProfilePic: "",
        content: "",
        timestamp: "",
        seen: false,
    });
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const {username} = useUserUtil();
    const {isAuthenticated} = useAuth();
    const [unseenMessagesCount, setUnseenMessages] = useState<number>(0);

    useEffect(() => {
        if (!isAuthenticated) return;
        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}ws`);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; //switch off logs
        stompClient.connect({}, () => {
            //console.log("✅ WebSocket connected");
            stompClient.subscribe(`/topic/messages/${username}`, (message) => {
                try {
                    const parsedMessage: Notification = JSON.parse(message.body);
                    //console.log("📩 New message received:", parsed);
                    setNotification({
                        senderUsername: parsedMessage.senderUsername ?? "",
                        senderProfilePic: parsedMessage.senderProfilePic ?? "",
                        content: parsedMessage.content ?? "",
                        timestamp: parsedMessage.timestamp ?? "",
                        seen: parsedMessage.seen ?? false,
                    });
                } catch (error) {
                    console.error("Failed to parse message: ", error);
                }
            });
            stompClientRef.current = stompClient;
        }, () => {});
        return () => {
            if (stompClientRef.current?.connected) {
                stompClientRef.current.disconnect(() => {
                    //console.log("🧹 Disconnected from WebSocket");
                });
            }
        };
    }, [username]);  //connects to WebSocket, gets notification (last message)

    useEffect(() => {
        const handleGetUnseenCount = async () => {
            try {
                const response= await getUnseenCount();
                if (response.data) {
                    setUnseenMessages(response.data.unseenCount);
                }
            } catch (error) {
                console.error("Unexpected error when fetching messages: ", error);
            }
        };
        if (isAuthenticated) handleGetUnseenCount();
    }, [isAuthenticated, notification]);  //fetches unseen messages count

    return (
        <MessagesContext.Provider value={{ notification, setNotification, unseenMessagesCount }}>
            {children}
        </MessagesContext.Provider>
    );
};