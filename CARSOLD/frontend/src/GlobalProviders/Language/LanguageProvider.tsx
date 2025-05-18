import React, {useCallback, useEffect, useState} from "react";
import { LanguageContext } from "./useLanguage.ts";
import {dictionary, DictionaryKey, Language} from "./dictionary.ts";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [language, setLanguage] = useState<Language>(() => {
        const stored = localStorage.getItem("app_language");
        return (stored as Language) || "pl";
    });

    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === "app_language" && e.newValue) {
                setLanguage(e.newValue as Language);
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const changeLanguage = useCallback((lang: Language) => {
        localStorage.setItem("app_language", lang);
        setLanguage(lang);
    }, []);

    const t = useCallback((key: DictionaryKey): string => {
        return dictionary[language][key] || key;
    }, [language]);

    console.log(language)

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};