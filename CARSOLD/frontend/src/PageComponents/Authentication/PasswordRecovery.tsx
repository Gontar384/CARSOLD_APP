import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {ReactElement, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import NavBar from "../../NavBar/NavBar.tsx";
import {api} from "../../Config/AxiosConfig/AxiosConfig.tsx";
import Footer from "../../NavBar/Footer.tsx";
import AnimatedBanner from "../../Banners/AnimatedBanner.tsx";
import {useUserCheck} from "../../NEW/AuthenticationPage/CustomHooks/UseUserCheck.ts";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";

// '/password-recovery' page
function PasswordRecovery(): ReactElement {

    //email state
    const [email, setEmail] = useState<string>("");

    const {emailExists, isActive, isOauth2} = useUserCheck();

    const { createDebouncedValue } = useUtil();

    //delays check 300 millis
    const debouncedEmail: string = createDebouncedValue(email, 300);

    //email info states
    const [emailIcon, setEmailIcon] = useState<IconDefinition | null>(null);

    //checks if email is correct and used by user
    useEffect(() => {
        let isMounted: boolean = true;

        if (email.length >= 5) {
            if (email.length <= 30) {
                const checkEmail = async () => {
                    try {
                        const emailResponse = await emailExists(email);
                        const isActiveResponse = await isActive(email);
                        const isOauth2Response = await isOauth2(email);
                        if (isMounted) {
                            if (emailResponse.data.exists && isActiveResponse.data.checks && !isOauth2Response.data.checks) {
                                setEmailIcon(faCircleCheck);
                            } else {
                                setEmailIcon(faCircleExclamation);
                            }
                        }
                    } catch (error) {
                        console.log("Error checking email: ", error)
                    }
                }
                checkEmail();

                return () => {
                    isMounted = false;
                };
            } else {
                setEmailIcon(faCircleExclamation);
            }
        } else {
            setEmailIcon(null);
        }
    }, [debouncedEmail])

    //state which will prevent user from spamming button
    const [isDisabledLog, setIsDisabledLog] = useState<boolean>(false);

    //state which displays 'email sent' banner
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

    //sends email with link
    const handleSendEmail = async () => {
        if (isDisabledLog) return;
        if (email.length >= 5 && email.length <= 30) {
            const emailResponse = await emailExists(email);
            const activeResponse = await isActive(email);
            const isOauth2Response = await isOauth2(email);
            if (emailResponse.data.exists && activeResponse.data.checks && !isOauth2Response.data.checks) {
                setIsDisabledLog(true);
                try {
                    const response = await api.get('api/auth/password-recovery', {
                        params: {email}
                    });
                    if (response.data) {
                        setIsEmailSent(true);
                    }
                } catch (error) {
                    console.log("Error sending email: ", error)
                } finally {
                    setTimeout(() => {
                        setIsDisabledLog(false);
                    }, 1000)
                }
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <div className="flex-grow flex flex-col items-center w-full mb-56">
                <div className="flex flex-col items-center w-10/12 min-w-[320px] xs:min-w-[450px] xs:max-w-[500px] lg:max-w-[530px]
                xl:max-w-[570px] 2xl:max-w-[640px] 3xl:max-w-[720px] mt-40 sm:mt-32 lg:mt-36 xl:mt-40 2xl:mt-48
                3xl:mt-56 pt-5 xs:pt-7 sm:pt-8 lg:pt-9 xl:pt-10 2xl:pt-11 3xl:pt-12 pb-10 xs:pb-11 sm:pb-12 lg:pb-14 xl:pb-16
                2xl:pb-[70px] 3xl-pb-[80px] gap-5 xs:gap-7 lg:gap-9 xl:gap-10 2xl:gap-11 3xl:gap-13 bg-lime rounded-sm">
                    <p className="text-xs xs:text-base 2xl:text-xl 3xl:text-2xl w-10/12">
                        Enter your email. We will automatically send you link to change your password.
                    </p>
                    <div className="relative w-7/12">
                        <input
                            className="w-full 3xl:h-11 p-1 pr-6 text-sm xs:text-lg 2xl:text-2xl 3xl:text-3xl rounded-sm"
                            placeholder="E-mail" type="text" value={email}
                            onChange={(e) => setEmail(e.target.value.trim())}/>
                        {emailIcon && <FontAwesomeIcon icon={emailIcon}
                                                       className="text-xl xs:text-[26px] 2xl:text-[30px] 3xl:text-[34px] absolute
                                                       right-1 xs:right-[6px] 2xl:right-[7px] 3xl:right-2 top-[5px] opacity-90"/>}
                    </div>
                    <button className="w-24 xs:w-32 2xl:w-44 3xl:w-48 h-7 xs:h-8 2xl:h-11 3xl:h-12 mt-2 3xl:mt-3 text-sm xs:text-lg
                     2xl:text-2xl 3xl:text-3xl rounded-sm shadow-xl hover:bg-white cursor-pointer"
                            onClick={handleSendEmail}>
                        Send
                    </button>
                </div>
            </div>
            {/*banner*/}
            {isEmailSent ?
                <AnimatedBanner text={"Email with link has been sent!"} onAnimationEnd={() => setIsEmailSent(false)}
                                delay={7000} color={"bg-lowLime"} z={"z-50"}/> : null}
            <Footer/>
        </div>
    )
}

export default PasswordRecovery;