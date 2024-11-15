import {Dispatch, ReactElement, SetStateAction} from "react";

//component with 'Login', 'Register' and 'Google Auth' headings, sets 'choose' state
//which defines what is displayed on 'Form' component
function Headings({setChoose}: { setChoose: Dispatch<SetStateAction<boolean>> }): ReactElement {

    //redirecting to Google auth page
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
             3xl:h-[52px] xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded divide-x divide-black shadow">
                <button className="w-1/2 hover:bg-white hover:rounded-l
                hover:cursor-pointer" onClick={() => setChoose(false)}>Login
                </button>
                <button className="w-1/2 hover:bg-white hover:rounded-r
                hover:cursor-pointer" onClick={() => setChoose(true)}>Register
                </button>
            </div>
            <button className="flex flex-row justify-center items-center w-11/12 h-8 xs:h-9 2xl:h-11 3xl:h-[52px] mt-2 rounded shadow
             hover:bg-white hover:rounded" onClick={handleGoogleAuth}>
                <img src={'src/assets/google.png'} alt='google' className="w-5 h-5 xs:w-6 xs:h-6
                 2xl:w-8 2xl:h-8 3xl:w-9 3xl:h-9 mr-1"/>
                <span className="text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl">Authenticate using Google</span>
            </button>
        </>
    )
}

export default Headings;