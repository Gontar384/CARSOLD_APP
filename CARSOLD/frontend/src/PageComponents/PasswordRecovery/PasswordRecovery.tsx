import Input from "../Authentication/AuthWindow/Atomic/Form/FormUtil/Input.tsx";
import React, {useEffect, useState} from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useUserInfo} from "../../CustomHooks/useUserInfo.ts";
import SubmitButton from "../Authentication/AuthWindow/Atomic/Form/FormUtil/SubmitButton.tsx";
import AnimatedBanner from "../../Additional/Banners/AnimatedBanner.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {sendPasswordRecoveryEmail} from "../../ApiCalls/Services/UserService.ts";
import {BadRequestError, NotFoundError} from "../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const PasswordRecovery: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [emailInfo, setEmailInfo] = useState<string>("");
    const [emailIcon, setEmailIcon] = useState<IconProp | null>(null);
    const {CreateDebouncedValue} = useUtil();
    const debouncedEmail: string = CreateDebouncedValue(email, 300);
    const {handleCheckLogin, handleCheckAccount} = useUserInfo();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
    const {t, language} = useLanguage();
    const {isMobile} = useUtil();
    document.title = `CARSOLD | ${t("tabTitle5")}`;

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
                const account = await handleCheckAccount(email);
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
            await sendPasswordRecoveryEmail(email, language === "ENG");
            setEmail("");
            setIsEmailSent(true);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                setEmailInfo(t("passwordRecovery4"))
            } else if (error instanceof BadRequestError) {
                setEmailInfo(t("passwordRecovery5"))
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 2000);
        }
    };

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-full max-w-[750px] mt-32 py-10 m:py-11 bg-lime
                ${isMobile ? "border-y" : "border"} border-gray-300 rounded`}>
                    <p className="w-11/12 text-center text-lg m:text-xl mb-8 m:mb-9">
                        {t("passwordRecovery1")}
                    </p>
                    <Input placeholder={"E-mail"} inputType={"text"} value={email} setValue={setEmail}
                           icon={emailIcon} info={emailInfo}/>
                    <SubmitButton label={t("passwordRecovery2")} disabled={isDisabled} onClick={handleSendPasswordRecoveryEmail}/>
                </div>
            </div>
            {isEmailSent && <AnimatedBanner text={t("passwordRecovery3")} onAnimationEnd={() => setIsEmailSent(false)}
                                            delay={4000} color={"bg-lowLime"} z={"z-50"}/>}
        </LayOut>
    )
}

export default PasswordRecovery