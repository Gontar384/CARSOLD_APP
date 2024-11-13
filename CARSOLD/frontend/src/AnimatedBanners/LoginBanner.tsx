import {ReactElement} from "react";

//animated banner which pops when user is authenticated during login process
function LoginBanner(): ReactElement {
    return (
        <div className="flex justify-center items-center fixed bottom-0 left-0 right-0 h-12
          sm1:h-16 bg-darkLime z-50 animate-slideIn">
            <p className="p-4 text-xl sm1:text-2xl text-center">Logged in successfully!</p>
        </div>
    )
}

export default LoginBanner;