import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, faCircleExclamation, faCircleCheck, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {ReactElement, useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import {NavigateFunction, useNavigate} from "react-router-dom";
import api from "../Config/AxiosConfig.tsx";
import {useAuth} from "../Config/AuthProvider.tsx";

function Form({choose}: { choose: boolean }): ReactElement {

    //user object management
    interface User {
        email: string,
        username: string,
        password: string
    }

    const [user, setUser] = useState<User>({
        email: "", username: "", password: ""
    })
    const [passwordRep, setPasswordRep] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    //for icon which change password input to visible
    const [inputType, setInputType] = useState<string>("password")
    const [eyeIcon, setEyeIcon] = useState<IconDefinition>(faEye);
    const toggleInput = (): void => {
        setInputType(inputType === "password" ? "text" : "password");
        setEyeIcon(eyeIcon === faEye ? faEyeSlash : faEye);
    }

    //for authorization management
    const navigate: NavigateFunction = useNavigate();
    const [token, setToken] = useState<string | null>(null);

    //url's
    const url = `${import.meta.env.VITE_BACKEND_URL}api/auth/register/check-email`;
    const url1 = `${import.meta.env.VITE_BACKEND_URL}api/auth/register/check-username`;
    const url2 = `${import.meta.env.VITE_BACKEND_URL}api/auth/register`;
    const url3 = `${import.meta.env.VITE_BACKEND_URL}api/auth/check-active`;
    const url4 = `${import.meta.env.VITE_BACKEND_URL}api/auth/check-oauth2`;
    const url5 = `${import.meta.env.VITE_BACKEND_URL}api/auth/login`;

    //live info management
    const [emailIcon, setEmailIcon] = useState<IconDefinition | null>(null);
    const [emailInfo, setEmailInfo] = useState<string>("");
    const [emailActive, setEmailActive] = useState<boolean>(false);
    const [usernameIcon, setUsernameIcon] = useState<IconDefinition | null>(null);
    const [usernameInfo, setUsernameInfo] = useState<string>("");
    const [usernameActive, setUsernameActive] = useState<boolean>(false);
    const [passwordIcon, setPasswordIcon] = useState<IconDefinition | null>(null)
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordActive, setPasswordActive] = useState<boolean>(false);
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconDefinition | null>(null);
    const [loginIcon, setLoginIcon] = useState<IconDefinition | null>(null);
    const [loginInfo, setLoginInfo] = useState<string>("");
    const [loginActive, setLoginActive] = useState<boolean>(false);

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
    const debouncedLogin = useDebouncedValue(login, 300);

    //terms of use
    const [termsCheck, setTermsCheck] = useState<boolean>(false);

    //checks email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    //checks if email already exists
    const emailExists =
        async (email: string): Promise<AxiosResponse<{ exists: boolean }>> => {
            return await api.get(`${url}`, {
                params: {email: email},
            });
        };

    //checks if username already exists
    const usernameExists =
        async (username: string): Promise<AxiosResponse<{ exists: boolean }>> => {
            return await api.get(`${url1}`, {
                params: {username: username},
            });
        };

    const isActive =
        async (login: string): Promise<AxiosResponse<{ comp: boolean }>> => {
            return await api.get(`${url3}`, {
                params: {login: login},
            });
        };

    const isOauth2 =
        async (login: string): Promise<AxiosResponse<{ comp: boolean }>> => {
            return await api.get(`${url4}`, {
                params: {login: login},
            });
        };

    //validate password
    const checksPassword = (password: string): boolean => {

        if (password.trim().length < 7 || password.trim().length > 25) {
            return false;
        }
        return !(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password));
    }

    //handle whole register process with lots of conditions
    const handleRegister = async (): Promise<void> => {
        if (user.email && user.username && user.password && passwordRep) {
            try {
                if (user.email.length > 30 || !validateEmail(user.email)) {
                    return;
                }
                const emailResponse = await emailExists(user.email);
                const isActiveResponse = await isActive(user.email);
                if (emailResponse.data.exists && isActiveResponse.data.comp) {
                    return;
                }
                if (user.username.length < 3 || user.username.length > 15) {
                    return;
                }
                const usernameResponse = await usernameExists(user.username);
                if (usernameResponse.data.exists && isActiveResponse.data.comp) {
                    return;
                }
                if (!checksPassword(user.password) || user.password !== passwordRep) {
                    return;
                }
                if (!termsCheck) {
                    return;
                }
                await api.post(`${url2}`, user)
                console.log("Registered successfully");
                //navigate
            } catch (error) {
                if (error) {
                    console.log("Something went wrong");
                }
                console.log("Error during register:", error)
            }
        }
    }

    const {checkAuth} = useAuth();

    const handleLogin = async (): Promise<void> => {
        if (login && password) {
            try {
                const emailResponse = await emailExists(login);
                const usernameResponse = await usernameExists(login);
                if (emailResponse.data.exists || usernameResponse.data.exists && password.length >= 7) {
                    const response = await api.get(`${url5}`,{
                        params: {login, password}
                    });
                    if (response){
                        setTimeout(async(): Promise<void> => {
                            await checkAuth();
                        }, 1000)
                        console.log(response.data);
                    }
                    if (!response.data) {
                        console.log("Authentication failed");
                    }
                }
            } catch (error) {
                console.log("Error during login: ", error);
            }
        }
    }

    //live checking login compatibility in DB
    useEffect((): void => {
        if (login.length >= 5) {
            const checkLogin = async (): Promise<void> => {
                try {
                    const emailResponse = await emailExists(login);
                    const usernameResponse = await usernameExists(login);
                    if (emailResponse.data.exists || usernameResponse.data.exists) {
                        setLoginIcon(faCircleCheck);
                        const isActiveResponse = await isActive(login);
                        const isOauth2Response = await isOauth2(login);
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
                    } else {
                        setLoginIcon(faCircleExclamation);
                        setLoginInfo("");
                        setLoginActive(false);
                    }
                } catch (error) {
                    console.log("Error checking email: ", error);
                }
            }
            checkLogin();
        } else {
            setLoginIcon(null);
            setLoginInfo("");
            setLoginActive(false);
        }
    }, [debouncedLogin])

    //live checking if email is valid
    useEffect((): void => {
        if (user.email.length >= 5) {
            if (validateEmail(user.email)) {
                if (user.email.length <= 30) {
                    const checkEmail = async () => {
                        try {
                            const response = await emailExists(user.email);
                            const isActiveResponse = await isActive(user.email);
                            if (response.data.exists && isActiveResponse.data.comp) {
                                setEmailIcon(faCircleExclamation);
                                setEmailInfo("Email is already taken.")
                                setEmailActive(true);
                            } else {
                                setEmailIcon(faCircleCheck);
                                setEmailInfo("");
                                setEmailActive(false);
                            }
                        } catch (error) {
                            console.log("Error checking email: ", error)
                        }
                    }
                    checkEmail().then();
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
    }, [user.email])

    //live checking if username is valid
    useEffect((): void => {
        if (user.username !== "") {
            if (user.username.length <= 15) {
                if (user.username.length >= 3) {
                    const checkUsername = async () => {
                        try {
                            const response = await usernameExists(user.username);
                            const isActiveResponse = await isActive(user.username);
                            if (response.data.exists && isActiveResponse.data.comp) {
                                setUsernameIcon(faCircleExclamation);
                                setUsernameInfo("Username already exists.")
                                setUsernameActive(true);
                            } else {
                                setUsernameIcon(faCircleCheck);
                                setUsernameInfo("")
                                setUsernameActive(false);
                            }
                        } catch (error) {
                            console.log("Error checking username: ", error);
                        }
                    }
                    checkUsername().then();
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
    }, [user.username])

    //live checking if password is valid
    useEffect((): void => {
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

    //if token 'pops' in localStorage, it navigates to /home
    //works on other tab, when user activates account using email
    useEffect((): () => void => {
        const storedToken: string | null = localStorage.getItem('token');
        setToken(storedToken);

        if (storedToken) {
            navigate('/home');
        }

        const handleStorageChange = (): void => {
            const updatedToken: string | null = localStorage.getItem('token');
            setToken(updatedToken);
        };

        window.addEventListener('storage', handleStorageChange);

        return (): void => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [token]);

    if (choose) {
        return (
            <div className="flex flex-col items-center w-72 sm2:w-80 sm1:w-96 h-64 pt-6 mt-6 gap-6
              text-xl sm1:text-2xl rounded-xl shadow-2xl ">
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-2 rounded-md" placeholder="E-mail or username" type="text"
                           value={login} onChange={(e): void => setLogin(e.target.value.trim())}/>
                    {loginIcon && <FontAwesomeIcon icon={loginIcon}
                                                   className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={loginActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{loginInfo}</p>
                </div>
                <input className="w-64 sm1:w-80 p-1 mb-6 rounded-md" placeholder="Password" type={inputType}
                       value={password} onChange={(e): void => setPassword(e.target.value.trim())}/>
                <div className="relative">
                    <button className="w-20 sm1:w-24 h-9 mt-2 rounded-md shadow-xl hover:bg-white cursor-pointer"
                    onClick={handleLogin}>Sign in
                    </button>
                    <button className="absolute left-32 cursor-pointer" onClick={toggleInput}><FontAwesomeIcon
                        icon={eyeIcon}/>
                    </button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center w-72 sm2:w-80 sm1:w-96 pt-6 mt-6 gap-6
             text-xl sm1:text-2xl rounded-xl shadow-2xl">
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-2 pr-12 rounded-md" placeholder="E-mail" type="text"
                           value={user.email} onChange={(e): void => setUser({...user, email: e.target.value.trim()})}/>
                    {emailIcon && <FontAwesomeIcon icon={emailIcon}
                                                   className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={emailActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{emailInfo}</p>
                </div>
                <div className="relative">
                    <input className="w-64 sm1:w-80  p-1 mb-2 pr-12 rounded-md" placeholder="Username" type="text"
                           value={user.username}
                           onChange={(e): void => setUser({...user, username: e.target.value.trim()})}/>
                    {usernameIcon && <FontAwesomeIcon icon={usernameIcon}
                                                      className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={usernameActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{usernameInfo}</p>
                </div>
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-2 pr-12 rounded-md" placeholder="Password" type={inputType}
                           value={user.password}
                           onChange={(e): void => setUser({...user, password: e.target.value.trim()})}/>
                    {passwordIcon && <FontAwesomeIcon icon={passwordIcon}
                                                      className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <p className={passwordActive ? "text-xs sm1:text-sm absolute top-10" : "hidden"}>{passwordInfo}</p>
                </div>
                <div className="relative">
                    <input className="w-64 sm1:w-80 p-1 mb-4 pr-12 rounded-md" placeholder="Repeat password"
                           type={inputType}
                           value={passwordRep} onChange={(e): void => setPasswordRep(e.target.value)}/>
                    {passwordRepIcon && <FontAwesomeIcon icon={passwordRepIcon}
                                                         className="text-2xl sm1:text-3xl absolute right-3 top-1 opacity-90"/>}
                    <div className="flex flex-row items-center text-base">
                        <input id="myCheckbox" type="checkbox" className="w-3 h-3 mr-3 bg-white border border-solid border-black
                        rounded-xl appearance-none checked:bg-black checked:border-white"
                               checked={termsCheck} onChange={(e): void => {
                            setTermsCheck(e.target.checked)
                        }}/>
                        <label htmlFor="myCheckbox">I accept</label>
                        <a href="" className="underline ml-1">terms of use.</a>
                    </div>
                </div>
                <div className="relative">
                    <button
                        className="w-20 sm1:w-24 h-9 mt-2 mb-8 rounded-md shadow-xl hover:bg-white cursor-pointer"
                        onClick={handleRegister}>Register
                    </button>
                    <button className="absolute left-32 sm1:left-40 cursor-pointer" onClick={toggleInput}>
                        <FontAwesomeIcon icon={eyeIcon}/>
                    </button>
                </div>
            </div>
        )
    }
}

export default Form