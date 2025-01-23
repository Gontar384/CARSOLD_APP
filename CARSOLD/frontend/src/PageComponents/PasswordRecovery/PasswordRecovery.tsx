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
                <div className="flex flex-col items-center w-11/12 max-w-[750px] mt-32 py-10 m:py-11 bg-lime rounded-sm">
                    <p className="w-11/12 text-center text-lg m:text-xl mb-8 m:mb-9">
                        Enter your email, so we will send you link for password change.
                    </p>
                    <Input placeholder={"E-mail"} inputType={"text"} value={email} setValue={setEmail} icon={emailIcon}/>
                    <SubmitButton label={"Send"} disabled={isDisabled} onClick={handleSendEmail}/>
                </div>
                {isEmailSent ?
                    <AnimatedBanner text={"Email with link has been sent!"} onAnimationEnd={() => setIsEmailSent(false)}
                                    delay={5000} color={"bg-lowLime"} z={"z-50"}/> : null}
            </div>
        </LayOut>
    )
}

export default PasswordRecovery