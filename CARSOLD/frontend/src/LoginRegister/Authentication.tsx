import Aside from "./Aside.tsx";
import Form from "./Form.tsx";
import Headings from "./Headings.tsx";
import {ReactElement, useState} from "react";
import NavBar from "../NavBar/NavBar.tsx";

function Authentication(): ReactElement {

    //state being changed in 'Headings' and used in 'Form',
    //defining what user choose: login or register form
    const [choose, setChoose] = useState<boolean>(false);

    //state being changed in 'Navbar' and user in 'Form', then passed to bars
    //defining lower bar 'presence' for animated bars
    const [lowerBar, setLowerBar] = useState<boolean>(false);

    return (
        <>
            <NavBar setLowerBar={setLowerBar}/>
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 sm:gap-2
             md:gap-4 xl:gap-8 mt-9 xs:mt-10 sm:mt-12 md:mt-14 lg:mt-16 xl:mt-20 2xl:mt-24 3xl:mt-28">
                <div className="flex flex-col items-center bg-lime py-6 xs:py-8 2xl:py-10 w-11/12 xs:w-10/12
                max-w-[360px] xs:max-w-[420px] sm:min-w-[420px]
                   2xl:max-w-[500px] 3xl:max-w-[600px] rounded-xl">
                    <Headings setChoose={setChoose}/>
                    <Form choose={choose} lowerBar={lowerBar}/>
                </div>
                <Aside/>
            </div>
        </>
    )
}

export default Authentication;