import React, {useEffect, useState} from "react";
import {MessageDto, MessagesContext, MessagesContextType} from "./useMessages.ts";
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
    const [messages, setMessages] = useState<MessageDto[]>([]);
    //
    // useEffect(() => {
    //     const socket = new SockJS('/ws');
    //     const client = Stomp.over(socket);
    //
    //     client.connect({}, (frame) => {
    //         console.log('Connected: ' + frame);
    //         setStompClient(client);
    //     });
    //
    //     return () => {
    //         if (stompClient) {
    //             stompClient.disconnect(() => {
    //                 console.log('Disconnected');
    //             });
    //         }
    //     };
    // }, [stompClient]);

    const subscribeToUser = (username: string) => {
        if (!stompClient) return;

        stompClient.connect({}, () => {
            stompClient.subscribe(`/topic/messages/${username}`, (messageOutput) => {
                const message: MessageDto = JSON.parse(messageOutput.body);
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        });
    };

    const sendMessage = (message: MessageDto) => {
        if (!stompClient) return;

        stompClient.send('/app/messages/john', {}, JSON.stringify(message));  // Adjust the endpoint as needed
    };

    const value: MessagesContextType = {messages, sendMessage, subscribeToUser,};

    return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};