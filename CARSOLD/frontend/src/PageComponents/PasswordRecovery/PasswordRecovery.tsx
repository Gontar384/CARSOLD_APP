import Input from "../../SharedComponents/FormUtil/Input.tsx";
import React, {useEffect, useState} from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useUserCheck} from "../../CustomHooks/useUserCheck.ts";
import {AxiosResponse} from "axios";
import SubmitButton from "../../SharedComponents/FormUtil/SubmitButton.tsx";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import AnimatedBanner from "../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const PasswordRecovery: React.FC = () => {

    const [email, setEmail] = useState<string>("");

    const [emailIcon, setEmailIcon] = useState<IconProp | null>(null);

    const { CreateDebouncedValue } = useUtil();
    const debouncedEmail: string = CreateDebouncedValue(email, 300);

    const { emailExists, isActive, isOauth2 } = useUserCheck();

    useEffect(() => {
        let isMounted: boolean = true;

        if (email.length >= 5) {
            if (email.length <= 30) {
                const checkEmail = async () => {
                    try {
                        const emailResponse: AxiosResponse = await emailExists(email);
                        const isActiveResponse: AxiosResponse = await isActive(email);
                        const isOauth2Response: AxiosResponse = await isOauth2(email);
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
                checkEmail().then();

                return () => {
                    isMounted = false;
                };
            } else {
                setEmailIcon(faCircleExclamation);
            }
        } else {
            setEmailIcon(null);
        }
    }, [debouncedEmail, email, emailExists, isActive, isOauth2])

    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

    const handleSendEmail = async () => {
        if (isDisabled) return;
        if (email.length >= 5 && email.length <= 30) {
            const emailResponse = await emailExists(email);
            const activeResponse = await isActive(email);
            const isOauth2Response = await isOauth2(email);
            if (emailResponse.data.exists && activeResponse.data.checks && !isOauth2Response.data.checks) {
                setIsDisabled(true);
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
                        setIsDisabled(false);
                    }, 2000)
                }
            }
        }
    }

    document.title = "CARSOLD | Password Recovery";

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center w-10/12 min-w-[310px] xs:max-w-[440px] lg:max-w-[470px]
                xl:max-w-[480px] 2xl:max-w-[640px] 3xl:max-w-[770px] mt-20 xs:mt-24 sm:mt-12 lg:mt-14 xl:mt-16 2xl:mt-[72px] 3xl:mt-20
                pt-5 xs:pt-7 sm:pt-8 lg:pt-9 xl:pt-10 2xl:pt-11 3xl:pt-12 pb-10 xs:pb-11 sm:pb-12 lg:pb-14 xl:pb-16 2xl:pb-[70px] 3xl-pb-[80px]
                gap-5 xs:gap-7 lg:gap-9 xl:gap-10 2xl:gap-11 3xl:gap-13 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl bg-lime rounded-sm">
                    <p className="text-center text-xs xs:text-base 2xl:text-xl 3xl:text-2xl w-10/12">
                        Enter your email, we will automatically send you link to change your password.
                    </p>
                    <Input placeholder={"E-mail"} inputType={"text"} value={email} setValue={setEmail}
                           icon={emailIcon}/>
                    <SubmitButton label={"Send"} disabled={isDisabled} onClick={handleSendEmail}/>
                    {isEmailSent ?
                        <AnimatedBanner text={"Email with link has been sent!"} onAnimationEnd={() => setIsEmailSent(false)}
                                        delay={7000} color={"bg-lowLime"} z={"z-50"}/> : null}
                </div>
            </div>
        </LayOut>
    )
}

export default PasswordRecovery