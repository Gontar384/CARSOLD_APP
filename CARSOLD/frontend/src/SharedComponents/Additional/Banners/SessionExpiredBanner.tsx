import React from "react";

const SessionExpiredBanner: React.FC = () => {
    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-white text-center rounded-sm shadow-lg">
                <p className="text-lg m:text-xl font-semibold">Your session has expired.</p>
                <p className="mt-2 text-sm m:text-base">You will be redirected to the login page shortly.</p>
            </div>
        </div>
    );
}

export default SessionExpiredBanner;