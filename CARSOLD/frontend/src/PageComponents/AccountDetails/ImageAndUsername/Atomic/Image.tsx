import React from "react";

const Image: React.FC = () => {
    return (
        <div className="w-20 h-20 border border-black rounded-full overflow-hidden">
            <img src="/kylo.jpg" alt="kylo" className="w-full h-full object-cover"/>
        </div>
    )
}

export default Image