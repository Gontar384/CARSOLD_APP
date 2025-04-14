import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";
import {useMessages} from "../../../GlobalProviders/Messages/useMessages.ts";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation} from "react-router-dom";

const MessageNotification: React.FC = () => {
    const {notification, setNotification} = useMessages();
    const {mobileWidth} = useUtil();
    const [animation, setAnimation] = useState<"animate-slideUpAppear" | "animate-slideDownDisappear" | null>(null);
    const [animation1, setAnimation1] = useState<"animate-slideDownShow" | "animate-slideUpShow" | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [imageError, setImageError] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (clearRef.current) clearTimeout(clearRef.current);
        if (notification.content !== "") {
            setVisible(false);
            requestAnimationFrame(() => {
                setVisible(true);
                if (!mobileWidth) {
                    setAnimation("animate-slideUpAppear");
                    timeoutRef.current = setTimeout(() => {
                        setAnimation("animate-slideDownDisappear");
                        clearRef.current = setTimeout(() => {
                            setNotification({ senderUsername: "", senderProfilePic: "", content: "" });
                        }, 300);
                    }, 6700);
                } else {
                    setAnimation1("animate-slideDownShow");
                    timeoutRef.current = setTimeout(() => {
                        setAnimation1("animate-slideUpShow");
                        clearRef.current = setTimeout(() => {
                            setNotification({ senderUsername: "", senderProfilePic: "", content: "" });
                        }, 200);
                    }, 6700);
                }
            });
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (clearRef.current) clearTimeout(clearRef.current);
        };
    }, [notification]);

    const blockDisplay = /^\/details\/messages(\/.*)?$/.test(location.pathname);

    return (
        visible && notification.content !== "" && !blockDisplay &&
        <div className={`fixed ${!mobileWidth ? `w-72 h-[90px] p-1 bottom-0 rounded-t-xl ring-4 ${animation}` 
            : `w-48 h-[74px] p-0.5 top-12 rounded-b-xl ring-[3px] ${animation1}`}
            right-0 bg-white ring-lime z-40`}>
            <div className="flex flex-row justify-center items-center gap-1 m:gap-1.5 pb-0.5 m:pb-1 border-b border-black">
                {notification.senderProfilePic !== "" && !imageError ?
                    <img src={notification.senderProfilePic} alt="Img" onError={() => setImageError(true)}
                         className="rounded-full w-7 h-7 m:w-8 m:h-8 border border-black"/>
                    : <FontAwesomeIcon icon={faCircleUser} className="w-7 h-7 m:w-8 m:h-8"/>}
                <p className="text-base m:text-lg font-bold">{notification.senderUsername}</p>
            </div>
            <div className="text-sm m:text-base break-words h-10 m:h-12 line-clamp-2 px-0.5 m:px-1">
                {notification.content}
            </div>
        </div>
    )
};

export default MessageNotification