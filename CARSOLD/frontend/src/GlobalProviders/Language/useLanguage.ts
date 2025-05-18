import {createContext, useContext} from "react";
import {DictionaryKey, Language} from "./dictionary.ts";

interface LanguageContext {
    language: Language;
    changeLanguage: (lang: Language) => void;
    t: (key: DictionaryKey) => string;
}

export const LanguageContext = createContext<LanguageContext | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within an LanguageProvider");

    return context;
};