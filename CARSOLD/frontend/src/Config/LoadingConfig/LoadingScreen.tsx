import {ReactElement} from "react";

function LoadingScreen(): ReactElement {
    return (
        <>
            {/*background blur*/}
            <div className="fixed inset-0 bg-black bg-opacity-20 z-50"></div>

            {/*loading spinner*/}
            <div className="flex items-center justify-center h-screen">
                <svg className="w-1/6 h-1/6" viewBox="0 0 50 50">
                    <circle className="animate-dash"
                            cx="25" cy="25" r="20" fill="none" stroke="lime" strokeWidth="4">
                    </circle>
                </svg>
            </div>
        </>
    );
}

export default LoadingScreen;