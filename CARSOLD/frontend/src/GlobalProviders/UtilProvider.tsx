import React, {createContext, useContext, useEffect, useState} from "react";

interface UtilContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    lowerBar: boolean;
    setLowerBar: React.Dispatch<React.SetStateAction<boolean>>;
    isWide: boolean;
    createDebouncedValue: <T>(value: T, delay: number) => T;
}

const UtilContext = createContext<UtilContextType | undefined>(undefined);

//manages dark mode, lower bar presence and window size
export const UtilProvider: React.FC<{children : React.ReactNode}> = ({ children }) => {

    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.body.style.transition = 'background-color 0.7s ease-in-out'; //enables transition
                document.body.style.backgroundColor = '#191a18';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.style.transition = 'background-color 0.7s ease-in-out';
                document.body.style.backgroundColor = 'white';
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };  //manages dark mode on click

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent)=> {
            if (event.key === 'theme'){
                const newMode: string | null = event.newValue;
                if (newMode === 'dark') {
                    setDarkMode(true);
                    document.body.style.backgroundColor = '#191a18';
                } else {
                    setDarkMode(false);
                    document.body.style.backgroundColor = 'white';
                }
            }
        }

        if (darkMode) {
            document.body.style.backgroundColor = '#191a18';
        } else {
            document.body.style.backgroundColor = 'white';
        }

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);  //manages dark mode on initial load

    const [lowerBar, setLowerBar] = useState<boolean>(false);

    const [isWide, setIsWide] = useState<boolean>(window.innerWidth >= 640);

    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth >= 640);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)

    }, [])  //manages isWide state

    //function which can set debounced value for useEffects to avoid too much requests be sent
    const createDebouncedValue = <T, >(value: T, delay: number): T => {
        const [debouncedValue, setDebouncedValue] = useState<T>(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);

        return debouncedValue;
    }

    return (
        <UtilContext.Provider value={{ darkMode, toggleDarkMode, lowerBar, setLowerBar, isWide, createDebouncedValue }}>
            {children}
        </UtilContext.Provider>
    );
};

export const useUtil = (): UtilContextType => {
    const context = useContext(UtilContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a UtilProvider');
    }
    return context;
};