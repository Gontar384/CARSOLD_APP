import React, {useEffect, useState} from "react";
import { UtilContext } from "./useUtil";

//manages dark mode, lower bar presence, window size, creates debounced values and recognize device: mobile/PC
export const UtilProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

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
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'theme') {
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
    }, [darkMode]);  //manages dark mode on initial load

    const [lowerBar, setLowerBar] = useState<boolean>(false);

    const [isWide, setIsWide] = useState<boolean>(window.innerWidth >= 450);

    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth >= 450);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)

    }, [])  //manages isWide state

    //function which can set debounced value for useEffects to avoid too much requests be sent
    const CreateDebouncedValue = <T, >(value: T, delay: number): T => {
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

    const [isMobile, setIsMobile] = useState<boolean>("ontouchstart" in window || navigator.maxTouchPoints > 0);

    useEffect(() => {
        const detectDeviceType = () => {
            setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
        };

        const handlePointerChange = (event: PointerEvent) => {
            setIsMobile(event.pointerType === "touch");
        };

        const handleResize = () => detectDeviceType();

        window.addEventListener("pointerdown", handlePointerChange);
        window.addEventListener("resize", handleResize);

        detectDeviceType();

        return () => {
            window.removeEventListener("pointerdown", handlePointerChange);
            window.removeEventListener("resize", handleResize);
        };
    }, []); //checks if user is on mobile / PC

    return (
        <UtilContext.Provider
            value={{darkMode, toggleDarkMode, lowerBar, setLowerBar, isWide, CreateDebouncedValue, isMobile}}>
            {children}
        </UtilContext.Provider>
    );
};