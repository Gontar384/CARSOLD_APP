import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";
import {useMessages} from "../../../GlobalProviders/Messages/useMessages.ts";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLocation, useNavigate} from "react-router-dom";

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
    const navigate = useNavigate();
    const [notificationDismissed, setNotificationDismissed] = useState<boolean>(false);
    const blockDisplay = /^\/details\/messages(\/.*)?$/.test(location.pathname);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (clearRef.current) clearTimeout(clearRef.current);
        if (!notification || notification.content === "") return;
        if (blockDisplay) {
            setVisible(false);
            setNotification({ senderUsername: "", senderProfilePic: "", content: "", timestamp: "", unseenCount: 0 });
            setNotificationDismissed(true);
            return;
        }
        if (notificationDismissed) return;

        setVisible(false);
        requestAnimationFrame(() => {
            setVisible(true);
            if (!mobileWidth) {
                setAnimation("animate-slideUpAppear");
                timeoutRef.current = setTimeout(() => {
                    setAnimation("animate-slideDownDisappear");
                    clearRef.current = setTimeout(() => {
                        setNotification({ senderUsername: "", senderProfilePic: "", content: "", timestamp: "", unseenCount: 0 });
                    }, 300);
                }, 6700);
            } else {
                setAnimation1("animate-slideDownShow");
                timeoutRef.current = setTimeout(() => {
                    setAnimation1("animate-slideUpShow");
                    clearRef.current = setTimeout(() => {
                        setNotification({ senderUsername: "", senderProfilePic: "", content: "", timestamp: "", unseenCount: 0 });
                    }, 200);
                }, 6700);
            }
        });
        setNotificationDismissed(false);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (clearRef.current) clearTimeout(clearRef.current);
        };
    }, [notification, blockDisplay]); //animates notification

    return (
        visible && notification.content !== "" && !blockDisplay &&
        <div className={`fixed ${!mobileWidth ? `w-72 h-[90px] p-1 bottom-0 rounded-t-xl ring-4 ${animation}` 
            : `w-48 h-[74px] p-0.5 top-12 rounded-b-xl ring-[3px] ${animation1}`}
            right-0 bg-white ring-lime z-40 cursor-pointer border border-black border-opacity-30`}
             onClick={() => navigate(`/details/messages?username=${notification.senderUsername}`)}>
            <div className="flex flex-row justify-center items-center gap-1 m:gap-1.5 pb-[3px] m:pb-[4px] border-b border-gray-300">
                {notification.senderProfilePic !== "" && !imageError ?
                    <img src={notification.senderProfilePic} alt="Img" onError={() => setImageError(true)}
                         className="rounded-full w-7 h-7 m:w-8 m:h-8 border border-black"/>
                    : <FontAwesomeIcon icon={faCircleUser} className="w-7 h-7 m:w-8 m:h-8"/>}
                <p className="text-base m:text-lg font-bold">{notification.senderUsername}</p>
            </div>
            <div className={`text-xs m:text-sm break-words line-clamp-2 h-[38px] m:h-[46px] px-1 m:px-1.5 py-[3px]
            ${((mobileWidth && notification.content.length < 30) || (!mobileWidth && notification.content.length < 40))
            && "flex items-center justify-center"} `}>
                {notification.content}
            </div>
        </div>
    )
};

export default MessageNotification