import React, {useState} from "react";

const RegisterForm: React.FC = () => {

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

    // For updating fields of the object state (user)
    const setObject = <T, >(field: keyof T, value: any) => {
        setUser((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <div className="flex flex-col items-center w-11/12 pb-8 pt-6 2xl:pb-10 2xl:pt-8 3xl:pb-11 3xl:pt-9
        mt-3 gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm shadow-2xl">

        </div>
    )
}

export default RegisterForm