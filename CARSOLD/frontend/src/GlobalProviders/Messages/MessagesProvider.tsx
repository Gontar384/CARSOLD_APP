import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { MessagesContext } from "./useMessages";
import {useUserUtil} from "../UserUtil/useUserUtil.ts";
import {useAuth} from "../Auth/useAuth.ts";
import {getUnseenMessages} from "../../ApiCalls/Services/MessageService.ts";

export interface Notification {
    senderUsername: string;
    senderProfilePic: string;
    content: string;
}

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<Notification>({
        senderUsername: "",
        senderProfilePic: "",
        content: ""
    });
    const [unseenMessages, setUnseenMessages] = useState<number>(0);
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const {username} = useUserUtil();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;
        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}ws`);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; //switch off logs

        stompClient.connect({}, () => {
            //console.log("✅ WebSocket connected");
            stompClient.subscribe(`/topic/messages/${username}`, (message) => {
                try {
                    const parsed: Notification = JSON.parse(message.body);
                    //console.log("📩 New message received:", parsed);
                    setNotification(parsed);
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
    }, [username]);

    useEffect(() => {
        const handleGetUnseenMessages = async () => {
            try {
                const response= await getUnseenMessages();
                if (response.data) {
                    setUnseenMessages(response.data.unseenCount);
                }
            } catch (error) {
                console.error("Unexpected error when fetching messages: ", error);
            }
        };
        if (isAuthenticated) handleGetUnseenMessages();
    }, [isAuthenticated, notification]);

    return (
        <MessagesContext.Provider value={{ notification, setNotification, unseenMessages }}>
            {children}
        </MessagesContext.Provider>
    );
};