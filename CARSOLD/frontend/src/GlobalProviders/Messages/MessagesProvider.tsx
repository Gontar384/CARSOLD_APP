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
    unseenCount: number;
}

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification>({
        senderUsername: "",
        senderProfilePic: "",
        content: "",
        timestamp: "",
        unseenCount: 0
    });
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const {username} = useUserUtil();
    const {isAuthenticated} = useAuth();
    const [unseenMessagesCount, setUnseenMessagesCount] = useState<number>(0);

    useEffect(() => {
        if (!isAuthenticated) return;
        const socketUrl = import.meta.env.VITE_BACKEND_URL.startsWith("https://")
            ? `${import.meta.env.VITE_BACKEND_URL.replace(/^http:/, 'https:')}/ws`
            : `${import.meta.env.VITE_BACKEND_URL}/ws`;
        const socket = new SockJS(socketUrl);
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
                        unseenCount: parsedMessage.unseenCount ?? 0,
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
                    setUnseenMessagesCount(response.data.unseenCount);
                }
            } catch (error) {
                console.error("Unexpected error when fetching messages: ", error);
            }
        };
        if (isAuthenticated) handleGetUnseenCount();
    }, [isAuthenticated]);  //fetches unseen conversations count on initial

    useEffect(() => {
        if (notification.unseenCount) {
            setUnseenMessagesCount(notification.unseenCount);
        }
    }, [notification]); //updates unseenMessagesCount when notification comes

    return (
        <MessagesContext.Provider value={{ notification, setNotification, unseenMessagesCount, setUnseenMessagesCount }}>
            {children}
        </MessagesContext.Provider>
    );
};