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

    const t = useCallback((key: DictionaryKey | null | undefined): string => {
        if (!key) return "";
        return dictionary[language]?.[key] || key;
    }, [language]);

    const translate = useCallback((category: TranslationCategory | null | undefined, key: string | null | undefined): string => {
        if (!category || !key) return "";
        const translations = dictionary[language]?.[category] as Record<string, string> | undefined;
        return translations?.[key] || key;
    }, [language]);

    const translateForBackend = useCallback((category: TranslationCategory | null | undefined, key: string | null | undefined): string => {
        if (!category || !key) return "";
        const translations = dictionary["ENG"]?.[category] as Record<string, string> | undefined;
        return translations?.[key] || key;
    }, []);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, translate, translateForBackend }}>
            {children}
        </LanguageContext.Provider>
    );
};