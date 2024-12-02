import React, {useEffect, useState} from "react";
import Loader from "./Atomic/Loader.tsx";
import LoginButton from "./Atomic/LoginButton.tsx";
import Dropdown from "./Atomic/Dropdown.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../../../../GlobalProviders/AuthProvider.tsx";
import {useItems} from "../../../../../GlobalProviders/ItemsProvider.tsx";
import {api} from "../../../../../Config/AxiosConfig/AxiosConfig.tsx";
import {useNavigate} from "react-router-dom";
import {useUtil} from "../../../../../GlobalProviders/UtilProvider.tsx";

//manages username fetch and logout function
export const useUserDetails = () => {

    const navigate = useNavigate();

    const { checkAuth, isAuthenticated } = useAuth();

    const [userDetails, setUserDetails] = useState<string>("");   //username fetched

    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);

    useEffect(() => {
        const handleUsernameFetch = async () => {
            if (!isAuthenticated) return;
            setUsernameFetched(false);
            try {
                const response = await api.get('api/get-username');
                if (response.data.username) {
                    setUserDetails(response.data.username);
                }
            } catch (error) {
                console.log("Error fetching username: ", error);
            } finally {
                setUsernameFetched(true);
            }
        }
        handleUsernameFetch().then();
    }, [isAuthenticated]);   //fetches username

    const logout = async () => {
        await api.get(`api/auth/logout`)
        setTimeout(async () => {
            await checkAuth();
            navigate('/authenticate');
        }, 1000);
    }  //logout

    return { userDetails, usernameFetched, logout }
}

const UserDetails: React.FC = () => {

    const { isAuthenticated, loadingAuth } = useAuth();

    const { createDebouncedValue } = useUtil();

    const { userDetails, usernameFetched } = useUserDetails();

    const [userIconAnimation, setUserIconAnimation] = useState<"animate-pop" | null>(null);

    const [barActive, setBarActive] = useState<boolean>(false);

    const [barHovered, setBarHovered] = useState<boolean>(false);

    const debouncedHover: boolean = createDebouncedValue(barHovered, 300)

    const [animationActive, setAnimationActive] = useState<boolean>(false);   //prevents too many animations

    const handleActivateBar = () => {
        if (!animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        }
        setBarActive(true);
        setBarHovered(true);
    }    //activates bar

    const handleDeactivateBar = () => {
        setUserIconAnimation(null);
        setBarHovered(false);
    }   //deactivates on mouseLeave

    useEffect(() => {
        if (!debouncedHover && !barHovered) {
            setBarActive(false);
            setAnimationActive(false);
        }
    }, [debouncedHover, barHovered]);  //for user-friendly delay

    const handleActivateBarKeyboard = () => {
        setBarActive(prev => !prev);
    }    //for keyboard

    const handleToggleBar = () => {
        setBarActive((prev) => !prev);
        if (!barActive && !animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        } else {
            setUserIconAnimation(null);
            setAnimationActive(false);
        }
    };   //activates for mobile

    const { messages } = useItems();


    if (loadingAuth) {
        return <Loader/>
    }

    return (
        <div
            className="flex justify-center items-center h-full min-w-[142px] lg:min-w-[178px] xl:min-w-[213px] 2xl:min-w-[268px] 3xl:min-w-[322px]">
            {isAuthenticated ? (
                usernameFetched ? (
                    <div className="relative h-full flex justify-center items-center"
                         onMouseEnter={handleActivateBar} onMouseLeave={handleDeactivateBar} onTouchStart={handleToggleBar}
                         onKeyDown={(event) => {if (event.key === "Enter") handleActivateBarKeyboard()}}>
                        <button className="flex flex-row items-center h-full gap-[2px] lg:gap-[3px] xl:gap-1 2xl:gap-[6px] 3xl:gap-2 relative">
                            <FontAwesomeIcon icon={faCircleUser}
                                             className={`mb-[3px] xl:mb-[1px] 2xl:mb-[2px] text-sm lg:text-[18px] xl:text-[22px] 2xl:text-[28px] 3xl:text-[34px] ${userIconAnimation}`}/>
                            <div className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 whitespace-nowrap cursor-pointer">
                                {userDetails}
                            </div>
                            {messages > 0 && (
                                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                                 className="absolute -right-[10px] lg:-right-[12px] xl:-right-[15px] 2xl:-right-[18px] 3xl:-right-[22px] top-[14px] lg:top-[16px]
                                                 xl:top-[20px] 2xl:top-[21px] text-[6px] lg:text-[7px] xl:text-[9px] 2xl:text-[11px] 3xl:text-[13px]"/>)}
                        </button>
                        <Dropdown barActive={barActive}/>
                    </div>
                ) : (
                    <Loader/>
                )
            ) : (
                <LoginButton/>
            )}
        </div>
    )
}

export default UserDetails
