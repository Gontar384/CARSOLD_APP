import NavBar from "../NavBar/NavBar.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";
import {useAuth} from "../Config/AuthConfig/AuthProvider.tsx";
import ShortNoDisBanner from "../AnimatedBanners/ShortNoDisBanner.tsx";

function PasswordRecoveryChange() {

    //states for password and repeated password
    const [password, setPassword] = useState<string>("");
    const [repPassword, setRepPassword] = useState<string>("");

    //states for inputs icons and info for user
    const [passwordIcon, setPasswordIcon] = useState<IconDefinition | null>(null);
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordActive, setPasswordActive] = useState<boolean>(false);
    const [repPasswordIcon, setRepPasswordIcon] = useState<IconDefinition | null>(null);

    //checks if password is strong enough
    const checksPassword = (password: string): boolean => {
        if (password.trim().length < 7 || password.trim().length > 25) {
            return false;
        }
        return !(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password));
    }

    //live checking if password is strong enough, displays info for user
    useEffect(() => {
        if (password !== "") {
            if (password.length >= 7) {
                if (password.length <= 25) {
                    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
                        setPasswordIcon(faCircleCheck);
                        setPasswordInfo("");
                        setPasswordActive(false);
                    } else {
                        setPasswordIcon(faCircleExclamation);
                        setPasswordInfo("Must include lowercase, uppercase and number.");
                        setPasswordActive(true);
                    }
                } else {
                    setPasswordIcon(faCircleExclamation);
                    setPasswordInfo("Password is too long.");
                    setPasswordActive(true);
                }
            } else {
                setPasswordIcon(faCircleExclamation);
                setPasswordInfo("Password is too short.");
                setPasswordActive(true);
            }
        } else {
            setPasswordIcon(null);
            setPasswordInfo("");
            setPasswordActive(false);
        }
    }, [password])

    //live checking if repeated password equals password
    useEffect(() => {
        if (password !== "" && repPassword !== "") {
            if (checksPassword(password)) {
                if (repPassword === password) {
                    setRepPasswordIcon(faCircleCheck);
                } else {
                    setRepPasswordIcon(faCircleExclamation);
                }
            } else {
                setRepPasswordIcon(null);
            }
        } else {
            setRepPasswordIcon(null);
        }
    }, [repPassword, password])

    //state which will prevent user from spamming button
    const [isDisabledLog, setIsDisabledLog] = useState<boolean>(false);

    //custom hook to check auth
    const {checkAuth} = useAuth();

    //state which displays 'password changed' banner
    const [isChanged, setIsChanged] = useState<boolean>(false);

    //sends new password to server and send token taken from url, then backend validates
    //them and change password and make user authenticated
    const handlePasswordChange = async () => {
        if (isDisabledLog) return;
        if (password && repPassword) {
            if (checksPassword(password) && password === repPassword) {
                setIsDisabledLog(true);
                const urlParams = new URLSearchParams(window.location.search);
                const token: string | null = urlParams.get('token');
                if (!token) return;
                try {
                     const response = await api.post('api/auth/password-recovery-change',{
                         token: token,
                         password: password,
                     });
                    if (response.data) {
                        setIsChanged(true);
                        setTimeout(async (): Promise<void>=>{
                            await checkAuth();
                        }, 2500)
                    }
                } catch (error) {
                    console.error("Error changing password: ", error);
                } finally {
                    setTimeout(()=>{
                        setIsDisabledLog(false);
                    }, 500)
                }
            }
        }
    }

    //state defining lower bar 'presence' for animated bar
    const [lowerBar, setLowerBar] = useState<boolean>(false);

    return (
        <>
            <NavBar setLowerBar={setLowerBar}/>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items-center w-10/12 min-w-[330px] xs:min-w-[450px] xs:max-w-[500px] lg:max-w-[530px] xl:max-w-[570px]
                2xl:max-w-[640px] 3xl:max-w-[720px] mt-24 xs:mt-[106px] sm:mt-28 lg:mt-32 xl:mt-[140px] 2xl:mt-[150px]
                3xl:mt-[160px] pt-5 xs:pt-7 sm:pt-8 lg:pt-9 xl:pt-10 2xl:pt-11 3xl:pt-12 pb-10 xs:pb-11 sm:pb-12 lg:pb-14
                xl:pb-16 2xl:pb-[70px] 3xl-pb-[80px] gap-5 xs:gap-7 lg:gap-9 xl:gap-10 2xl:gap-11 3xl:gap-13 bg-lime rounded-xl">
                    <p className="w-10/12 text-sm xs:text-xl 2xl:text-2xl 3xl:text-3xl text-center">
                        Now, you can change your password:
                    </p>
                    <div className="relative w-7/12">
                        <input
                            className="w-full p-1 pr-6 text-sm xs:text-lg 2xl:text-2xl 3xl:text-3xl rounded-md"
                            placeholder="New password" value={password}
                            onChange={(e) => setPassword(e.target.value.trim())}/>
                        {passwordIcon && <FontAwesomeIcon icon={passwordIcon}
                                                          className="text-xl xs:text-[26px] 2xl:text-[30px] 3xl:text-[34px]
                                                          absolute right-1 xs:right-[6px] 2xl:right-[7px] 3xl:right-2 top-[5px] opacity-90"/>}
                        <p className={passwordActive ? "text-[9px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[42px] lg:top-[46px] 2xl:top-[50px]" : "hidden"}>
                            {passwordInfo}
                        </p>
                    </div>
                    <div className="relative w-7/12">
                        <input
                            className="w-full p-1 pr-6 text-sm xs:text-lg 2xl:text-2xl 3xl:text-3xl rounded-md"
                            placeholder="Repeat password" value={repPassword}
                            onChange={(e) => setRepPassword(e.target.value.trim())}/>
                        {repPasswordIcon && <FontAwesomeIcon icon={repPasswordIcon}
                                                             className="text-xl xs:text-[26px] 2xl:text-[30px] 3xl:text-[34px]
                                                              absolute right-1 xs:right-[6px] 2xl:right-[7px] 3xl:right-2 top-[5px] opacity-90"/>}
                    </div>
                    <button className="w-24 xs:w-32 2xl:w-44 3xl:w-48 h-7 xs:h-8 2xl:h-11 3xl:h-12 mt-2
                     3xl:mt-3 text-sm xs:text-lg 2xl:text-2xl 3xl:text-3xl rounded-md shadow-xl hover:bg-white cursor-pointer"
                            onClick={handlePasswordChange}>
                        Change
                    </button>
                </div>
            </div>
            {isChanged ? <ShortNoDisBanner text={"Password successfully changed!" } lowerBar={lowerBar}/> : null}
        </>
    )
}

export default PasswordRecoveryChange;