import Input from "../../SharedComponents/FormUtil/Input.tsx";
import React, {useEffect, useState} from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useUserInfo} from "../../CustomHooks/useUserInfo.ts";
import SubmitButton from "../../SharedComponents/FormUtil/SubmitButton.tsx";
import AnimatedBanner from "../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {sendPasswordRecoveryEmail} from "../../ApiCalls/Service/UserService.ts";
import {BadRequestError, NotFoundError} from "../../ApiCalls/Errors/CustomErrors.ts";

const PasswordRecovery: React.FC = () => {

    document.title = "CARSOLD | Password Recovery";
    const [email, setEmail] = useState<string>("");
    const [emailInfo, setEmailInfo] = useState<string>("");
    const [emailIcon, setEmailIcon] = useState<IconProp | null>(null);
    const {CreateDebouncedValue} = useUtil();
    const debouncedEmail: string = CreateDebouncedValue(email, 300);
    const {handleCheckLogin, handleCheckInfo} = useUserInfo();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

    useEffect(() => {
        setEmailInfo("");
        if (email.length < 5) {
            setEmailIcon(null);
            return;
        }
        if (email.length > 30) {
            setEmailIcon(faCircleExclamation);
            return;
        }

        const checkEmail = async () => {
            const present = await handleCheckLogin(email);
            if (present) {
                const account = await handleCheckInfo(email);
                if (account.active) {
                    if (account.oauth2) {
                        setEmailIcon(faCircleExclamation);
                    } else {
                        setEmailIcon(faCircleCheck);
                    }
                } else {
                    setEmailIcon(faCircleExclamation);
                }
            } else {
                setEmailIcon(faCircleExclamation);
            }
        };

        checkEmail();

    }, [debouncedEmail]);  //checks provided email

    const handleSendPasswordRecoveryEmail = async () => {
        if (isDisabled || email.length < 5 || email.length > 30) return;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

        setIsDisabled(true);
        try {
            await sendPasswordRecoveryEmail(email);
            setEmail("");
            setIsEmailSent(true);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                setEmailInfo("Email address not found.")
            } else if (error instanceof BadRequestError) {
                setEmailInfo("Couldn't send email.")
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 2000);
        }
    };

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div
                    className="flex flex-col items-center w-11/12 max-w-[750px] mt-32 py-10 m:py-11 bg-lime rounded-sm">
                    <p className="w-11/12 text-center text-lg m:text-xl mb-8 m:mb-9">
                        Enter your email, so we will send you link for password change.
                    </p>
                    <Input placeholder={"E-mail"} inputType={"text"} value={email} setValue={setEmail}
                           icon={emailIcon} info={emailInfo}/>
                    <SubmitButton label={"Send"} disabled={isDisabled} onClick={handleSendPasswordRecoveryEmail}/>
                </div>
            </div>
            {isEmailSent &&
                <AnimatedBanner text={"Email with link has been sent!"} onAnimationEnd={() => setIsEmailSent(false)}
                                delay={4000} color={"bg-lowLime"} z={"z-50"}/>}
        </LayOut>
    )
}

export default PasswordRecovery