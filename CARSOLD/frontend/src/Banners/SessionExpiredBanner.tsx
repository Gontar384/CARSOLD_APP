//session expired banner, which pops, when there is error with authentication and user
//is redirected and unauthenticated
const SessionExpiredBanner = () => {
    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-white text-center rounded shadow-lg">
                <p className="text-base sm1:text-lg font-semibold">Your session has expired.</p>
                <p className="mt-2 text-xs sm1:text-sm">You will be redirected to the login page shortly.</p>
            </div>
        </div>
    );
};

export default SessionExpiredBanner;