import {ReactElement} from "react";

function LoadingScreen(): ReactElement {
    return (
        <>
            {/* Background blur */}
            <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-20 z-40"></div>

            {/* Loading spinner */}
            <div className="flex items-center justify-center fixed top-0 left-0 w-screen h-screen z-50">
                <div className="w-14 h-14 sm1:w-24 sm1:h-24 border-4 sm1:border-8 border-t-lime border-l-white
              border-b-lime border-r-white rounded-full animate-spinBounce">
                </div>
            </div>
        </>
    );
}

export default LoadingScreen;