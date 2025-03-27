import React from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import SearchFilters from "./SearchFilters/SearchFilters.tsx";

const Home: React.FC = () => {

    document.title = "CARSOLD | Home";

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <SearchFilters/>
            </div>
        </LayOut>
    )
}

export default Home