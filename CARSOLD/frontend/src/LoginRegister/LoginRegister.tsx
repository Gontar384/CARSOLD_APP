import Aside from "./Aside.tsx";
import Form from "./Form.tsx";
import Headings from "./Headings.tsx";
import {ReactElement, useState} from "react";
import NavBar from "../NavBar/NavBar.tsx";

function LoginRegister(): ReactElement {

    //state being changed in 'Headings' and used in 'Form',
    //defining what user choose: login or register form
    const [choose, setChoose] = useState<boolean>(true);

    return (
        <>
            <NavBar/>
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start
             pt-8 sm2:pt-10 sm:pt-28 md:pt-28 sm:gap-4 md:gap-12 lg:gap-28">
                <div className="flex flex-col justify-center items-center bg-lime pt-8 pb-12
                 sm3:px-2 sm2:px-6 sm1:px-8 rounded-xl">
                    <Headings setChoose={setChoose}/>
                    <Form choose={choose}/>
                </div>
                <Aside/>
            </div>
        </>
    )
}

export default LoginRegister;