import {Dispatch, ReactElement, SetStateAction} from "react";
import {useNavigate} from "react-router-dom";

//component with 'Login', 'Register' and 'Google Auth' headings, sets 'choice' state
//which defines what is displayed on 'AuthWindow' component
function Headings({setChoice}: { setChoice: Dispatch<SetStateAction<"login" | "register">> }): ReactElement {

    //navigates user
    const navigate = useNavigate();

    //navigates to new route and updates 'choice'
    const handleNavigation = (destination: "login" | "register") => {
        navigate(`/authenticate/${destination}`);
        setChoice(destination);
    }

    //redirects to Google auth page
    const handleGoogleAuth = async () => {
        try {
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}oauth2/authorization/google`;
        } catch (error) {
            console.error('Error during google authentication:', error);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-center w-11/12 text-base h-8 xs:h-9 2xl:h-11
             3xl:h-[52px] xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm divide-x divide-black shadow">
                <button className="w-1/2 hover:bg-white
                hover:cursor-pointer" onClick={() => handleNavigation("login")}>Login
                </button>
                <button className="w-1/2 hover:bg-white
                hover:cursor-pointer" onClick={() => handleNavigation("register")}>Register
                </button>
            </div>
            <button className="flex flex-row justify-center items-center w-11/12 h-8 xs:h-9 2xl:h-11 3xl:h-[52px] mt-2 rounded-sm shadow
             hover:bg-white" onClick={handleGoogleAuth}>
                <img src="/google.png" alt='google' className="w-5 h-5 xs:w-6 xs:h-6
                 2xl:w-8 2xl:h-8 3xl:w-9 3xl:h-9 mr-1"/>
                <span className="text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl">Authenticate using Google</span>
            </button>
        </>
    )
}

export default Headings;