import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faCircleExclamation, faCircleCheck, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {ReactElement, useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";
import {useAuth} from "../Config/AuthConfig/AuthProvider.tsx";

//this function-component is basically handling register and login processes and
//gives info about to user and navigates user
//gets 'choose' state updates from 'Headings'
function Form({choose}: { choose: boolean }): ReactElement {

    //user object for register
    interface User {
        email: string,
        username: string,
        password: string
    }

    //user and repeated password states
    const [user, setUser] = useState<User>({
        email: "", username: "", password: ""
    })
    const [passwordRep, setPasswordRep] = useState<string>("");

    //state which will prevent user from spamming button
    const [isDisabledReg, setIsDisabledReg] = useState<boolean>(false);

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
                if (emailResponse.data.exists && isActiveResponse.data.comp) {
                    return;
                }
                if (user.username.length < 3 || user.username.length > 15) {
                    return;
                }
                const usernameResponse: AxiosResponse = await usernameExists(user.username);
                if (usernameResponse.data.exists && isActiveResponse.data.comp) {
                    return;
                }
                if (!checksPassword(user.password) || user.password !== passwordRep) {
                    return;
                }
                if (!termsCheck) {
                    return;
                }
                setIsDisabledReg(true);
                await api.post(`api/auth/register`, user)
            } catch (error) {
                console.log("Error during register:", error)
            } finally {
                setTimeout((): void => {
                    setIsDisabledReg(false);
                }, 2000)
            }
        }
    };

    //checks if email is valid format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    //checks if email already exists
    const emailExists = async (email: string) => {
            return await api.get(`api/auth/register/check-email`, {
                params: {email: email},
            });
        };

    //checks if username already exists
    const usernameExists = async (username: string) => {
            return await api.get(`api/auth/register/check-username`, {
                params: {username: username},
            });
        };

    //checks if user's account is active
    const isActive = async (login: string)=> {
            return await api.get(`api/auth/check-active`, {
                params: {login: login},
            });
        };

    //validates password
    const checksPassword = (password: string): boolean => {

        if (password.trim().length < 7 || password.trim().length > 25) {
            return false;
        }
        return !(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password));
    }

    //function which can set debounced value for useEffects to avoid too much requests sent
    const useDebouncedValue = <T, >(value: T, delay: number): T => {
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
                                if (response.data.exists && isActiveResponse.data.comp) {
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
                                if (response.data.exists && isActiveResponse.data.comp) {
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

    //live checking if password is valid, displays info for user
    useEffect(()=> {
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
    useEffect((): void => {
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

    //check if user is authenticated and automatically navigates (used after successful login)
    const {checkAuth} = useAuth();

    //state which will prevent user from spamming button
    const [isDisabledLog, setIsDisabledLog] = useState<boolean>(false);

    //handles login with some conditions
    const handleLogin = async () => {
        if (isDisabledLog) return;
        if (login && password) {
            try {
                const emailResponse: AxiosResponse = await emailExists(login);
                const usernameResponse: AxiosResponse = await usernameExists(login);
                if (emailResponse.data.exists || usernameResponse.data.exists && password.length >= 7) {
                    setIsDisabledLog(true);
                    const response = await api.get(`api/auth/login`, {
                        params: {login, password}
                    });
                    if (response) {
                        setTimeout(async (): Promise<void> => {
                            await checkAuth();
                        }, 1000)
                    }
                    if (!response.data) {
                        console.log("Authentication failed");
                    }
                }
            } catch (error) {
                console.log("Error during login: ", error);
            } finally {
                setTimeout((): void => {
                    setIsDisabledLog(false);
                }, 2000)
            }
        }
    }

    //checks if user were authenticated via Google and when, prevents him from using normal login
    const isOauth2 = async (login: string) => {
            return await api.get(`api/auth/check-oauth2`, {
                params: {login: login},
            });
        };

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
                                if (isActiveResponse.data.comp) {
                                    setLoginInfo("")
                                    setLoginActive(false);
                                    if (isOauth2Response.data.comp) {
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
    const toggleInput = ()=> {
        setInputType(inputType === "password" ? "text" : "password");
        setEyeIcon(eyeIcon === faEye ? faEyeSlash : faEye);
    }

    if (!choose) {
        return (
            <div className="flex flex-col items-center w-72 sm2:w-80 sm1:w-96 pt-6 mt-6 gap-6
             text-xl sm1:text-2xl rounded-xl shadow-2xl">
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-2 pr-12 rounded-md" placeholder="E-mail" type="text"
                           value={user.email} onChange={(e) => setUser({...user, email: e.target.value.trim()})}/>
                    {emailIcon && <FontAwesomeIcon icon={emailIcon}
                                                   className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={emailActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{emailInfo}</p>
                </div>
                <div className="relative">
                    <input className="w-64 sm1:w-80  p-1 mb-2 pr-12 rounded-md" placeholder="Username" type="text"
                           value={user.username}
                           onChange={(e) => setUser({...user, username: e.target.value.trim()})}/>
                    {usernameIcon && <FontAwesomeIcon icon={usernameIcon}
                                                      className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={usernameActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{usernameInfo}</p>
                </div>
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-2 pr-12 rounded-md" placeholder="Password" type={inputType}
                           value={user.password}
                           onChange={(e) => setUser({...user, password: e.target.value.trim()})}/>
                    {passwordIcon && <FontAwesomeIcon icon={passwordIcon}
                                                      className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={passwordActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{passwordInfo}</p>
                </div>
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-4 pr-12 rounded-md" placeholder="Repeat password"
                           type={inputType}
                           value={passwordRep} onChange={(e) => setPasswordRep(e.target.value)}/>
                    {passwordRepIcon && <FontAwesomeIcon icon={passwordRepIcon}
                                                         className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <div className="flex flex-row items-center text-base">
                        <input id="myCheckbox" type="checkbox" className="w-3 h-3 mr-3 bg-white border border-solid border-black
                        rounded-xl appearance-none checked:bg-black checked:border-white"
                               checked={termsCheck} onChange={(e) => {
                            setTermsCheck(e.target.checked)
                        }}/>
                        <label htmlFor="myCheckbox">I accept</label>
                        <a href="" className="underline ml-1">terms of use.</a>
                    </div>
                </div>
                <div className="relative">
                    <button
                        className="w-20 sm1:w-24 h-9 mt-2 mb-8 rounded-md shadow-xl hover:bg-white cursor-pointer"
                        onClick={handleRegister} disabled={isDisabledReg}>Register
                    </button>
                    <button className="absolute left-36 sm1:left-44 bottom-24 cursor-pointer" onClick={toggleInput}>
                        <FontAwesomeIcon icon={eyeIcon}/>
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center w-72 sm2:w-80 sm1:w-96 h-72 pt-6 mt-6 gap-6
              text-xl sm1:text-2xl rounded-xl shadow-2xl ">
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-2 rounded-md" placeholder="E-mail or username" type="text"
                           value={login} onChange={(e) => setLogin(e.target.value.trim())}/>
                    {loginIcon && <FontAwesomeIcon icon={loginIcon}
                                                   className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={loginActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{loginInfo}</p>
                </div>
                <input className="w-64 sm1:w-80 p-1 rounded-md" placeholder="Password" type={inputType}
                       value={password} onChange={(e) => setPassword(e.target.value.trim())}/>
                <div className="flex flex-row justify-left w-64 sm1:w-80">
                    <a href="" className="text-base underline">Forgot password?</a>
                </div>
                <div className="relative">
                    <button className="w-20 sm1:w-24 h-9 mt-2 rounded-md shadow-xl hover:bg-white cursor-pointer"
                            onClick={handleLogin} disabled={isDisabledLog}>Sign in
                    </button>
                    <button className="absolute left-36 sm1:left-44 bottom-16 cursor-pointer" onClick={toggleInput}>
                        <FontAwesomeIcon icon={eyeIcon}/>
                    </button>
                </div>
            </div>
        )
    }
}

export default Form