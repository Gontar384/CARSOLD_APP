import {ReactElement} from "react";

function LoadingScreen(): ReactElement {
    return (
        <>
            {/*background blur*/}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>

            {/*loading spinner*/}
            <div className="flex items-center justify-center fixed inset-0 z-50">
                <div className="w-14 h-14 sm1:w-24 sm1:h-24 border-4 sm1:border-8 border-t-lime border-l-white
              border-b-lime border-r-white rounded-full animate-spinBounce">
                </div>
            </div>
        </>
    );
}

export default LoadingScreen;