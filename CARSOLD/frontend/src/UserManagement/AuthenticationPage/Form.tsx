import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faCircleExclamation, faCircleCheck, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {ReactElement, useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import {api} from "../../Config/AxiosConfig/AxiosConfig.tsx";
import {useAuth} from "../../Config/AuthConfig/AuthProvider.tsx";
import ShortNoDisappearBanner from "../../AnimatedBanners/ShortNoDisappearBanner.tsx";
import WrongPasswordBanner from "../../AnimatedBanners/WrongPasswordBanner.tsx";
import LongDisappearBanner from "../../AnimatedBanners/LongDisappearBanner.tsx";
import {useNavigate} from "react-router-dom";

//this function-component is basically handling register and login processes
//gets 'choose' state updates from 'Headings' and 'lowerBar' state from 'NavBar'
//some functions used in 'Form' are below main component, because they're exported and used in other components
function Form({choose, lowerBar}: { choose: boolean; lowerBar: boolean }): ReactElement {

    //user object for register
    interface User {
        email: string,
        username: string,
        password: string
    }

    //user object state
    const [user, setUser] = useState<User>({
        email: "", username: "", password: ""
    })

    //repeated password state
    const [passwordRep, setPasswordRep] = useState<string>("");

    //state which will prevent user from spamming button
    const [isDisabledReg, setIsDisabledReg] = useState<boolean>(false);

    //state which displays banner when user is registered successfully
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    //handles whole register process with some conditions
    const handleRegister = async () => {
        if (isDisabledReg) return;
        if (user.email && user.username && user.password && passwordRep) {
            try {
                if (user.email.length > 30 || !validateEmail(user.email)) {
                    return;
                }
                const emailResponse: AxiosResponse = await emailExists(user.email);
                const isActiveResponse: AxiosResponse = await isActive(user.email);
                if (emailResponse.data.exists && isActiveResponse.data.checks) {
                    return;
                }
                if (user.username.length < 3 || user.username.length > 15) {
                    return;
                }
                const usernameResponse: AxiosResponse = await usernameExists(user.username);
                if (usernameResponse.data.exists && isActiveResponse.data.checks) {
                    return;
                }
                if (!checksPassword(user.password) || user.password !== passwordRep) {
                    return;
                }
                if (!termsCheck) {
                    return;
                }
                setIsDisabledReg(true);
                const response = await api.post(`api/auth/register`, user);
                if (response.data) {
                    setIsRegistered(true);
                }
            } catch (error) {
                console.log("Error during register:", error)
            } finally {
                setTimeout((): void => {
                    setIsDisabledReg(false);
                }, 1000)
            }
        }
    };

    //checks if email is valid format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    //checks if username already exists
    const usernameExists = async (username: string) => {
        return await api.get(`api/auth/register/check-username`, {
            params: {username: username},
        });
    };

    //email info states
    const [emailIcon, setEmailIcon] = useState<IconDefinition | null>(null);
    const [emailInfo, setEmailInfo] = useState<string>("");
    const [emailActive, setEmailActive] = useState<boolean>(false);

    //useEffect activates, when this value changes, after 300millis user stops writing
    const debouncedEmail: string = useDebouncedValue(user.email, 300);

    //live checking if email is valid, displays info for user
    useEffect(() => {
        let isMounted: boolean = true;

        if (user.email.length >= 5) {
            if (validateEmail(user.email)) {
                if (user.email.length <= 30) {
                    const checkEmail = async () => {
                        try {
                            const response = await emailExists(user.email);
                            const isActiveResponse = await isActive(user.email);
                            if (isMounted) {
                                if (response.data.exists && isActiveResponse.data.checks) {
                                    setEmailIcon(faCircleExclamation);
                                    setEmailInfo("Email is already taken.")
                                    setEmailActive(true);
                                } else {
                                    setEmailIcon(faCircleCheck);
                                    setEmailInfo("");
                                    setEmailActive(false);
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
                    setEmailInfo("Email is too long.")
                    setEmailActive(true);
                }
            } else {
                setEmailIcon(faCircleExclamation);
                setEmailInfo("It doesn't look like an email...")
                setEmailActive(true);
            }
        } else {
            setEmailIcon(null);
            setEmailInfo("")
            setEmailActive(false);
        }
    }, [debouncedEmail])

    //username info states
    const [usernameIcon, setUsernameIcon] = useState<IconDefinition | null>(null);
    const [usernameInfo, setUsernameInfo] = useState<string>("");
    const [usernameActive, setUsernameActive] = useState<boolean>(false);

    //delays check 300 millis
    const debouncedUsername: string = useDebouncedValue(user.username, 300);

    //live checking if username is valid, displays info for user
    useEffect(() => {
        let isMounted: boolean = true;

        if (user.username !== "") {
            if (user.username.length <= 15) {
                if (user.username.length >= 3) {
                    const checkUsername = async () => {
                        try {
                            const response = await usernameExists(user.username);
                            const isActiveResponse = await isActive(user.username);
                            if (isMounted) {
                                if (response.data.exists && isActiveResponse.data.checks) {
                                    setUsernameIcon(faCircleExclamation);
                                    setUsernameInfo("Username already exists.")
                                    setUsernameActive(true);
                                } else {
                                    setUsernameIcon(faCircleCheck);
                                    setUsernameInfo("")
                                    setUsernameActive(false);
                                }
                            }
                        } catch (error) {
                            console.log("Error checking username: ", error);
                        }
                    }
                    checkUsername().then();

                    return () => {
                        isMounted = false;
                    }
                } else {
                    setUsernameIcon(faCircleExclamation);
                    setUsernameInfo("Username is too short.")
                    setUsernameActive(true);
                }
            } else {
                setUsernameIcon(faCircleExclamation);
                setUsernameInfo("Username is too long.")
                setUsernameActive(true);
            }
        } else {
            setUsernameIcon(null);
            setUsernameInfo("")
            setUsernameActive(false);
        }
    }, [debouncedUsername])

    //password info states
    const [passwordIcon, setPasswordIcon] = useState<IconDefinition | null>(null)
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordActive, setPasswordActive] = useState<boolean>(false);

    //live checking if password is strong enough, displays info for user
    useEffect(() => {
        if (user.password !== "") {
            if (user.password.length >= 7) {
                if (user.password.length <= 25) {
                    if (/[A-Z]/.test(user.password) && /[a-z]/.test(user.password) && /\d/.test(user.password)) {
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
    }, [user.password])

    //repeated password info state
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconDefinition | null>(null);

    //live checking if repeated password equals password
    useEffect(() => {
        if (user.password !== "" && passwordRep !== "") {
            if (checksPassword(user.password)) {
                if (passwordRep === user.password) {
                    setPasswordRepIcon(faCircleCheck);
                } else {
                    setPasswordRepIcon(faCircleExclamation);
                }
            } else {
                setPasswordRepIcon(null);
            }
        } else {
            setPasswordRepIcon(null);
        }
    }, [passwordRep, user.password])

    //terms of use state
    const [termsCheck, setTermsCheck] = useState<boolean>(false);

    //login and password states
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    //function used before user authentication, to let user log in only if username and password are valid
    //it is used to prevent app from responding with unauthenticated error or cors error, which is already
    //being handled with api.interceptors and in default it leads to session expiration
    const validateUser = async (login: string, password: string) => {
        return await api.get('api/auth/validate-user', {
            params: {login: login, password: password},
        });
    }

    //check if user is authenticated and automatically navigates (used after successful login)
    const {checkAuth} = useAuth();

    //state which will prevent user from spamming button
    const [isDisabledLog, setIsDisabledLog] = useState<boolean>(false);

    //state which displays banner 'user authenticated'
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    //state which displays banner 'wrong password'
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);

    //handles login with some conditions
    const handleLogin = async () => {
        if (isDisabledLog) return;
        if (login && password) {
            try {
                const emailResponse: AxiosResponse = await emailExists(login);
                const usernameResponse: AxiosResponse = await usernameExists(login);
                const validateResponse: AxiosResponse = await validateUser(login, password);
                if (emailResponse.data.exists || usernameResponse.data.exists && password.length >= 7) {
                    setIsDisabledLog(true);
                    if (!validateResponse.data.isValid) {
                        setWrongPassword(true);
                        return;
                    }
                    const response = await api.get(`api/auth/login`, {
                        params: {login, password}
                    });
                    if (response) {
                        setIsLoggedIn(true);
                        setTimeout(async () => {
                            await checkAuth();
                        }, 2500)
                    }
                    if (!response.data) {
                        console.log("Authentication failed");
                    }
                }
            } catch (error) {
                console.log("Error during login: ", error);
            } finally {
                setTimeout(() => {
                    setIsDisabledLog(false);
                }, 500)
            }
        }
    }

    //login info states
    const [loginIcon, setLoginIcon] = useState<IconDefinition | null>(null);
    const [loginInfo, setLoginInfo] = useState<string>("");
    const [loginActive, setLoginActive] = useState<boolean>(false);

    //delays check 300 millis
    const debouncedLogin: string = useDebouncedValue(login, 300);

    //live checking and validating login, displays info for user
    useEffect(() => {
        let isMounted = true;

        if (login.length >= 5) {
            const checkLogin = async (): Promise<void> => {
                try {
                    const emailResponse: AxiosResponse = await emailExists(login);
                    const usernameResponse: AxiosResponse = await usernameExists(login);
                    if (isMounted) {
                        if (emailResponse.data.exists || usernameResponse.data.exists) {
                            setLoginIcon(faCircleCheck);
                            const isActiveResponse: AxiosResponse = await isActive(login);
                            const isOauth2Response: AxiosResponse = await isOauth2(login);
                            if (isMounted) {
                                if (isActiveResponse.data.checks) {
                                    setLoginInfo("")
                                    setLoginActive(false);
                                    if (isOauth2Response.data.checks) {
                                        setLoginInfo("Please authenticate using google.")
                                        setLoginActive(true);
                                    }
                                } else {
                                    setLoginInfo("Please confirm your account on email.")
                                    setLoginActive(true);
                                }
                            }
                        } else {
                            setLoginIcon(faCircleExclamation);
                            setLoginInfo("");
                            setLoginActive(false);
                        }
                    }
                } catch (error) {
                    console.log("Error checking email: ", error);
                }
            }
            checkLogin();

            return () => {
                isMounted = false;
            }
        } else {
            setLoginIcon(null);
            setLoginInfo("");
            setLoginActive(false);
        }
    }, [debouncedLogin])

    //states for icon, which changes password input
    const [inputType, setInputType] = useState<string>("password")
    const [eyeIcon, setEyeIcon] = useState<IconDefinition>(faEye);

    //changes password input
    const toggleInput = () => {
        setInputType(inputType === "password" ? "text" : "password");
        setEyeIcon(eyeIcon === faEye ? faEyeSlash : faEye);
    }

    //hook to navigate user
    const navigate = useNavigate();

    return (
        <>
            {choose ? (
                <>{/*register form*/}
                    <div className="flex flex-col items-center w-11/12 pb-8 pt-6 2xl:pb-10 2xl:pt-8 3xl:pb-11 3xl:pt-9 mt-3 gap-6 xs:gap-7 2xl:gap-8
                     3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm shadow-2xl">
                        {/*email input container*/}
                        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
                            <input className="w-full p-1 pr-12 rounded-sm 3xl:h-12" placeholder="E-mail" type="text"
                                   value={user.email}
                                   onChange={(e) => setUser({...user, email: e.target.value.trim()})}/>
                            {emailIcon && <FontAwesomeIcon icon={emailIcon}
                                                           className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px] absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                            <p className={emailActive ? "text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[41px] 2xl:top-[43px] 3xl:top-[50px]" : "hidden"}>{emailInfo}</p>
                        </div>
                        {/*username input container*/}
                        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
                            <input className="w-full p-1 pr-12 rounded-sm 3xl:h-12" placeholder="Username"
                                   type="text"
                                   value={user.username}
                                   onChange={(e) => setUser({...user, username: e.target.value.trim()})}/>
                            {usernameIcon && <FontAwesomeIcon icon={usernameIcon}
                                                              className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px] absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                            <p className={usernameActive ? "text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[41px] 2xl:top-[42px] 3xl:top-[50px]" : "hidden"}>{usernameInfo}</p>
                        </div>
                        {/*password input container*/}
                        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
                            <input className="w-full p-1 pr-12 rounded-sm 3xl:h-12" placeholder="Password"
                                   type={inputType}
                                   value={user.password}
                                   onChange={(e) => setUser({...user, password: e.target.value.trim()})}/>
                            {passwordIcon && <FontAwesomeIcon icon={passwordIcon}
                                                              className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px] absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                            <p className={passwordActive ? "text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[41px] 2xl:top-[43px] 3xl:top-[50px]" : "hidden"}>{passwordInfo}</p>
                        </div>
                        {/*repeated password input container*/}
                        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
                            <input className="w-full p-1 mb-4 pr-12 rounded-sm 3xl:h-12" placeholder="Repeat password"
                                   type={inputType}
                                   value={passwordRep} onChange={(e) => setPasswordRep(e.target.value)}/>
                            {passwordRepIcon && <FontAwesomeIcon icon={passwordRepIcon}
                                                                 className="text-2xl xs:text-[27px] 3xl:text-[36px] absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                            {/*checkbox and button container*/}
                            <div
                                className="flex flex-row items-center text-xs xs:text-[14px] 2xl:text-[18px] 3xl:text-[21px] mt-1 2xl:mt-2 relative">
                                {/*checkbox and link*/}
                                <input id="myCheckbox" type="checkbox" className="w-[8px] h-[8px] xs:w-[10px] xs:h-[10px]
                                 2xl:w-[13px] 2xl:h-[13px] 3xl:w-[15px] 3xl:h-[15px] mr-3 bg-white border border-solid border-black
                                 rounded-full appearance-none checked:bg-black checked:border-white"
                                       checked={termsCheck} onChange={(e) => {
                                    setTermsCheck(e.target.checked)
                                }}/>
                                <label htmlFor="myCheckbox">Accept</label>
                                <button className="underline ml-1">terms of use.</button>
                                {/*password button*/}
                                <button className="absolute right-0 cursor-pointer"
                                        onClick={toggleInput}>
                                    <FontAwesomeIcon icon={eyeIcon}
                                                     className="text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl"/>
                                </button>
                            </div>
                        </div>
                        {/*register button*/}
                        <button
                            className="w-28 xs:w-40 2xl:w-44 h-9 xs:h-10 2xl:h-11 3xl:w-52 3xl:h-12 rounded-sm shadow-xl hover:bg-white cursor-pointer"
                            onClick={handleRegister} disabled={isDisabledReg}>Register
                        </button>
                    </div>
                    {/*banner*/}
                    {isRegistered ?
                        <LongDisappearBanner
                            text={"Registered successfully! We've sent you e-mail with confirmation link. Check it out!"}
                            lowerBar={lowerBar} onAnimationEnd={() => setIsRegistered(false)}/> : null}
                </>
            ) : (
                <> {/*login form*/}
                    <div className="flex flex-col items-center w-11/12 pb-8 pt-6 2xl:pb-10 2xl:pt-8 3xl:pb-11 3xl:pt-9 mt-3 gap-6
                     xs:gap-7 2xl:gap-8 3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm shadow-2xl ">
                        {/*login input container*/}
                        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
                            <input className="w-full p-1 3xl:h-12 rounded-sm" placeholder="E-mail or username"
                                   type="text"
                                   value={login} onChange={(e) => setLogin(e.target.value.trim())}/>
                            {loginIcon && <FontAwesomeIcon icon={loginIcon}
                                                           className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px] absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                            <p className={loginActive ? "text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[41px] 2xl:top-[43px] 3xl:top-[50px]" : "hidden"}>{loginInfo}</p>
                        </div>
                        {/*password input container*/}
                        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
                            <input className="w-full p-1 mb-2 2xl:mb-3 3xl:h-12 rounded-sm" placeholder="Password"
                                   type={inputType}
                                   value={password} onChange={(e) => setPassword(e.target.value.trim())}/>
                            {/*link*/}
                            <button onClick={() => navigate('/password-recovery')}
                                    className="text-xs xs:text-[14px] 2xl:text-[18px] 3xl:text-[21px] underline">Forgot
                                password?
                            </button>
                            {/*password button*/}
                            <button className="absolute right-0 cursor-pointer"
                                    onClick={toggleInput}>
                                <FontAwesomeIcon icon={eyeIcon}/>
                            </button>
                        </div>
                        {/*sign in button*/}
                        <button
                            className="w-28 xs:w-40 2xl:w-44 h-9 xs:h-10 2xl:h-11 3xl:w-52 3xl:h-12 rounded-sm shadow-xl hover:bg-white cursor-pointer"
                            onClick={handleLogin} disabled={isDisabledLog}>Sign in
                        </button>
                    </div>
                    {/*banners*/}
                    {isLoggedIn ? <ShortNoDisappearBanner text={"Logged in successfully!"} lowerBar={lowerBar}/> : null}
                    {wrongPassword ? <WrongPasswordBanner lowerBar={lowerBar}
                                                          onAnimationEnd={() => setWrongPassword(false)}/> : null}
                </>
            )}
        </>
    )
}

//function which can set debounced value for useEffects to avoid too much requests sent
export const useDebouncedValue = <T, >(value: T, delay: number): T => {
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

//checks if email already exists
export const emailExists = async (email: string) => {
    return await api.get(`api/auth/register/check-email`, {
        params: {email: email},
    });
};

//checks if user's account is active
export const isActive = async (login: string) => {
    return await api.get(`api/auth/check-active`, {
        params: {login: login},
    });
};

//checks if password is strong enough
export const checksPassword = (password: string): boolean => {
    if (password.trim().length < 7 || password.trim().length > 25) {
        return false;
    }
    return !(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password));
}

//checks if user were authenticated via Google and when, prevents him from using normal login
export const isOauth2 = async (login: string) => {
    return await api.get(`api/auth/check-oauth2`, {
        params: {login: login},
    });
};

export default Form;