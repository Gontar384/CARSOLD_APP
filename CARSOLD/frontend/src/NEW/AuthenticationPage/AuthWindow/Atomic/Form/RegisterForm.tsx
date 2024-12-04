import React, {useState} from "react";
import Input from "./Atomic/Input.tsx";
import SubmitButton from "./Atomic/SubmitButton.tsx";

const RegisterForm: React.FC = () => {

    interface User {
        email: string,
        username: string,
        password: string
    }

    const [user, setUser] = useState<User>({
        email: "", username: "", password: ""
    })

    const [passwordRep, setPasswordRep] = useState<string>("");

    const [inputType, setInputType] = useState<"text" | "password">("password");


    return (
        <div className="flex flex-col items-center w-11/12 pb-8 pt-6 2xl:pb-10 2xl:pt-8 3xl:pb-11 3xl:pt-9
        mt-3 gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm shadow-2xl">
            <Input placeholder={"E-mail"} inputType={"text"} value={user.email} field={"email"} setValue={setUser}/>
            <Input placeholder={"Username"} inputType={"text"} value={user.username} field={"username"} setValue={setUser}/>
            <Input placeholder={"Password"} inputType={inputType} setInputType={setInputType} value={user.password} field={"password"} setValue={setUser}/>
            <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType} value={passwordRep} setValue={setPasswordRep} hasEye={true}/>
            <SubmitButton label={"Register"} onClick={() => console.log("test")}/>
        </div>
    )
}

export default RegisterForm