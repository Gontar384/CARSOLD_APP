import {createContext, useContext} from "react";
import {Message} from "./MessagesProvider.tsx";

export interface MessagesContextType {
    latestMessage: Message;
    unseenMessages: Message[];
}

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const useMessages = (): MessagesContextType => {
    const context = useContext(MessagesContext);
    if (!context) throw new Error("useMessages must be used within a MessagesProvider");
    return context;
};
