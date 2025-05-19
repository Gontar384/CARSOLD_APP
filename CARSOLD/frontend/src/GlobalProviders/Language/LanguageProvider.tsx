import React, {useCallback, useEffect, useState} from "react";
import { LanguageContext } from "./useLanguage.ts";
import {dictionary, DictionaryKey, Language, TranslationCategory} from "./dictionary.ts";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [language, setLanguage] = useState<Language>(() => {
        const stored = localStorage.getItem("app_language");
        return (stored as Language) || "POL";
    });
    const [disabled, setDisabled] = useState<boolean>(false);

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
        if (disabled) return;
        setDisabled(true);

        localStorage.setItem("app_language", lang);
        setLanguage(lang);

        setTimeout(() => setDisabled(false), 300);
    }, [disabled]);

    const t = useCallback((key: DictionaryKey): string => {
        return dictionary[language][key] || key;
    }, [language]);

    const translateBackend = useCallback(
        (category: TranslationCategory, value: string): string => {
            const translations = dictionary[language][category] as Record<string, string>;
            return translations?.[value] || value;
        },
        [language]
    );

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, translateBackend }}>
            {children}
        </LanguageContext.Provider>
    );
};