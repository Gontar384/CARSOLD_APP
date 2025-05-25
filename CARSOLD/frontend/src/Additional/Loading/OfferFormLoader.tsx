import React from "react";

const OfferFormLoader: React.FC = () => {
    return (
        <div className="flex items-center justify-center fixed inset-0 w-full h-full bg-black bg-opacity-30 z-50">
            <div className="flex space-x-3">
                {[0, 1, 2].map((i) =>
                    <div className="w-4 h-8 bg-white rounded-md animate-pulseBar"
                         key={i} style={{ animationDelay: `${i * 0.2}s` }}/>)}
            </div>
        </div>
    )
};

export default OfferFormLoader