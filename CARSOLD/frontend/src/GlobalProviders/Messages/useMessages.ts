import React, {createContext, useContext} from "react";
import {Notification} from "./MessagesProvider.tsx";

export interface MessagesContextType {
    notification: Notification;
    setNotification: React.Dispatch<React.SetStateAction<Notification>>;
    unseenMessagesCount: number;
    setUnseenMessagesCount: React.Dispatch<React.SetStateAction<number>>;
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = (): MessagesContextType => {
    const context = useContext(MessagesContext);
    if (!context) throw new Error("useMessages must be used within a MessagesProvider");
    return context;
};
