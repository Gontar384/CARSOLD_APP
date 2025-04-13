import {createContext, useContext} from "react";

export interface MessageDto {
    content: string;
    sender: string;
    timestamp: string;
}

export interface MessagesContextType {
    messages: MessageDto[];
    sendMessage: (message: MessageDto) => void;
    subscribeToUser: (username: string) => void;
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = (): MessagesContextType => {
    const context = useContext(MessagesContext);
    if (context === undefined) throw new Error("useMessages must be used within an MessagesProvider");

    return context;
}