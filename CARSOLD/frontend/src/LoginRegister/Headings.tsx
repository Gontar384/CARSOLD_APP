import React, {ReactElement} from "react";

function Headings({setChoose}:
                      { setChoose: React.Dispatch<React.SetStateAction<boolean>>; }): ReactElement {

    //redirecting to Google auth page
    const handleGoogleAuth = async (): Promise<void> => {
        try {
            window.location.href = 'http://localhost:8080/oauth2/authorization/google';
        } catch (error) {
            console.error('Error during google authentication:', error);
        }
    };

    return (
        <>
            <div className="flex flex-row justify-center w-80 h-10 sm1:w-96 text-xl
         sm1:text-2xl rounded divide-x divide-black shadow">
                <button className="w-40 sm1:w-48 py-1 px-4 text-center hover:bg-white hover:rounded-l
                hover:cursor-pointer" onClick={(): void => setChoose(true)}>Login
                </button>
                <button className="w-40 sm1:w-48 py-1 px-4 text-center hover:bg-white hover:rounded-r
                hover:cursor-pointer" onClick={(): void => setChoose(false)}>Register
                </button>
            </div>
            <button className="flex flex-row justify-center items-center w-80 sm1:w-96 h-9 mt-2 rounded shadow
             hover:bg-white hover:rounded" onClick={handleGoogleAuth}>
                <img src={'src/assets/google.png'} alt='google' className="h-6 w-6 sm1:w-7 sm1:h-7"/>
                <span className="text-base sm1:text-xl">Authenticate using Google</span>
            </button>
        </>
    )
}

export default Headings;