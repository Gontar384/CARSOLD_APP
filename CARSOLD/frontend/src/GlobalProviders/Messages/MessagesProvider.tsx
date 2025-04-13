import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { MessagesContext } from "./useMessages";
import {useUserUtil} from "../UserUtil/useUserUtil.ts";
import {useAuth} from "../Auth/useAuth.ts";
import {getUnseenMessages} from "../../ApiCalls/Services/MessageService.ts";

export interface Message {
    senderUsername: string;
    receiverUsername: string;
    content: string;
    timestamp: string;
    seen: boolean;
}

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [latestMessage, setLatestMessage] = useState<Message>({
        senderUsername: "",
        receiverUsername: "",
        content: "",
        timestamp: "",
        seen: false
    });
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const {username} = useUserUtil();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}ws`);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; //switch off logs

        stompClient.connect({}, () => {
            //console.log("✅ WebSocket connected");
            stompClient.subscribe(`/topic/messages/${username}`, (message) => {
                try {
                    const parsed: Message = JSON.parse(message.body);
                    //console.log("📩 New message received:", parsed);
                    setLatestMessage(parsed);
                } catch (error) {
                    console.error("Failed to parse message: ", error);
                }
            });
            stompClientRef.current = stompClient;
        }, (error) => {
            console.error("WebSocket for messages connection error:", error);
        });

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
                    setUnseenMessages(response.data);
                }
            } catch (error) {
                console.error("Unexpected error when fetching messages: ", error);
            }
        };
        if (isAuthenticated) handleGetUnseenMessages();
    }, [isAuthenticated, latestMessage]);

    console.log(latestMessage)

    return (
        <MessagesContext.Provider value={{ latestMessage, unseenMessages }}>
            {children}
        </MessagesContext.Provider>
    );
};