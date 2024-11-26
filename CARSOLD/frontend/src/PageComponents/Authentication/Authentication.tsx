import Aside from "./Aside.tsx";
import Form from "./Form.tsx";
import Headings from "./Headings.tsx";
import {ReactElement, useEffect, useState} from "react";
import NavBar from "../../NavBar/NavBar.tsx";
import Footer from "../../NavBar/Footer.tsx";
import {useNavigate, useParams} from "react-router-dom";

// '/authenticate' page
function Authentication(): ReactElement {

    //state that retrieves params from URL
    const {section} = useParams();

    //navigates user
    const navigate = useNavigate();

    //state being changed in 'Headings' and used in 'Form', defines what is displayed
    //if section is likely extracted from url - it sets choice to that value, if not - defaults 'login'
    const [choice, setChoice] = useState<"login" | "register">("login");

    //checks for section change and navigates user
    useEffect(() => {
        const validSections: Array<"login" | "register"> = [
            "login", "register"];
        if (section && validSections.includes(section as never)) {
            setChoice(section as "login" | "register");
        } else {
            navigate("/authenticate/login", {replace: true});
        }
    }, [section, navigate])

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <div className="flex-grow flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 sm:gap-2
             md:gap-4 xl:gap-8 mt-12 xs:mt-14 sm:mt-16 lg:mt-[72px] xl:mt-20 2xl:mt-24 3xl:mt-28 xl:mb-14">
                <div className="flex flex-col items-center bg-lime py-6 xs:py-8 2xl:py-10 w-11/12 xs:w-10/12
                 max-w-[360px] xs:max-w-[420px] sm:min-w-[420px]
                   2xl:max-w-[500px] 3xl:max-w-[600px] rounded-sm">
                    <Headings setChoice={setChoice}/>
                    <Form choice={choice}/>
                </div>
                <Aside/>
            </div>
            <Footer/>
        </div>
    )
}

export default Authentication;