import React, {ReactElement} from "react";

function Headings({setChoose}:
                      { setChoose: React.Dispatch<React.SetStateAction<boolean>>; }): ReactElement {
    return (
        <div className="flex flex-row justify-center w-80 h-10 sm1:w-96 text-xl
         sm1:text-2xl divide-x divide-black shadow ">
            <button className="w-40 sm1:w-48 py-1 px-4 text-center hover:bg-white hover:rounded-l-xl
              hover:rounded-bl-xl hover:cursor-pointer" onClick={(): void => setChoose(true)}>Login
            </button>
            <button className="w-40 sm1:w-48 py-1 px-4 text-center hover:bg-white hover:rounded-r-xl
              hover:rounded-br-xl hover:cursor-pointer" onClick={(): void => setChoose(false)}>Register
            </button>
        </div>
    )
}

export default Headings;